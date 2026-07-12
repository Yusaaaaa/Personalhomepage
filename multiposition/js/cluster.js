/** Co-occurrence regions: pure-JS DBSCAN + scoring */

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dlat = toRad(lat2 - lat1);
  const dlon = toRad(lon2 - lon1);
  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parsePois(allPois) {
  const items = [];
  for (let i = 0; i < allPois.length; i++) {
    const p = allPois[i];
    if (!p || !p.location) continue;
    const parts = String(p.location).split(",");
    const lng = parseFloat(parts[0]);
    const lat = parseFloat(parts[1]);
    if (isNaN(lat) || isNaN(lng)) continue;
    items.push({
      name: p.name || "",
      address: p.address || "",
      keyword: p._keyword || "",
      lat,
      lng,
      type: p.type || "",
      tel: p.tel || "",
      id: p.id || "",
    });
  }
  return items;
}

function dbscan(points, epsKm, minSamples) {
  const n = points.length;
  const labels = new Array(n);
  for (let i = 0; i < n; i++) labels[i] = undefined;
  let clusterId = 0;

  function regionQuery(i) {
    const neighbors = [];
    for (let j = 0; j < n; j++) {
      if (haversineKm(points[i].lat, points[i].lng, points[j].lat, points[j].lng) <= epsKm) {
        neighbors.push(j);
      }
    }
    return neighbors;
  }

  for (let i = 0; i < n; i++) {
    if (labels[i] !== undefined) continue;
    const neighbors = regionQuery(i);
    if (neighbors.length < minSamples) {
      labels[i] = -1;
      continue;
    }
    labels[i] = clusterId;
    const queue = neighbors.slice();
    const inQueue = {};
    for (let q = 0; q < queue.length; q++) inQueue[queue[q]] = true;

    for (let qi = 0; qi < queue.length; qi++) {
      const j = queue[qi];
      if (labels[j] === -1) labels[j] = clusterId;
      if (labels[j] !== undefined) continue;
      labels[j] = clusterId;
      const jNeighbors = regionQuery(j);
      if (jNeighbors.length >= minSamples) {
        for (let t = 0; t < jNeighbors.length; t++) {
          const nb = jNeighbors[t];
          if (!inQueue[nb]) {
            inQueue[nb] = true;
            queue.push(nb);
          }
        }
      }
    }
    clusterId += 1;
  }

  for (let i = 0; i < n; i++) {
    if (labels[i] === undefined) labels[i] = -1;
  }
  return labels;
}

function mean(arr) {
  if (!arr.length) return 0;
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += arr[i];
  return s / arr.length;
}

function setIntersect(a, b) {
  const out = [];
  for (let i = 0; i < a.length; i++) {
    if (b.indexOf(a[i]) !== -1) out.push(a[i]);
  }
  return out;
}

function setDiff(a, b) {
  const out = [];
  for (let i = 0; i < a.length; i++) {
    if (b.indexOf(a[i]) === -1) out.push(a[i]);
  }
  return out;
}

function summaryText(keywords, meanR, coverage) {
  const sorted = keywords.slice().sort();
  let kwText = sorted.slice(0, 4).join("、");
  if (sorted.length > 4) kwText += "等";
  const dist = meanR < 1 ? `约 ${Math.round(meanR * 1000)} 米` : `约 ${meanR.toFixed(1)} 公里`;
  if (coverage >= 1) return `完整覆盖：${kwText}，步行范围 ${dist}`;
  return `部分覆盖：${kwText}，核心范围 ${dist}`;
}

/**
 * @param {Array} allPois Amap raw POIs (with _keyword)
 * @param {string[]} keywords
 * @param {{ epsKm?: number, matchMode?: 'all'|'partial', minKeywords?: number }} options
 */
export function findRegions(allPois, keywords, options) {
  options = options || {};
  const epsKm = options.epsKm != null ? options.epsKm : 1.2;
  const matchMode = options.matchMode || "all";
  const minKeywords = options.minKeywords != null ? options.minKeywords : 2;

  const items = parsePois(allPois);
  if (items.length < 2) return [];

  const labels = dbscan(items, epsKm, 2);
  const clusters = {};
  for (let i = 0; i < labels.length; i++) {
    const lb = labels[i];
    if (lb < 0) continue;
    if (!clusters[lb]) clusters[lb] = [];
    clusters[lb].push(items[i]);
  }

  const required = keywords.slice();
  const needCount =
    matchMode === "all" ? required.length : Math.max(2, Math.min(minKeywords, required.length));

  const results = [];
  const labelKeys = Object.keys(clusters);

  for (let c = 0; c < labelKeys.length; c++) {
    const members = clusters[labelKeys[c]];
    const presentMap = {};
    for (let i = 0; i < members.length; i++) {
      if (members[i].keyword) presentMap[members[i].keyword] = true;
    }
    const present = Object.keys(presentMap);
    const hit = setIntersect(present, required);
    if (hit.length < needCount) continue;
    if (matchMode === "all" && hit.length < required.length) continue;

    const centerLat = mean(members.map((m) => m.lat));
    const centerLng = mean(members.map((m) => m.lng));
    const dists = members.map((m) => haversineKm(centerLat, centerLng, m.lat, m.lng));
    const maxR = dists.length ? Math.max.apply(null, dists) : 0;
    const meanR = mean(dists);

    const coverage = hit.length / Math.max(required.length, 1);
    const compactScore = 1 / (1 + meanR);
    const richness = Math.min(members.length / (required.length * 2), 1);
    const score = Math.round((0.55 * coverage + 0.3 * compactScore + 0.15 * richness) * 10000) / 10000;

    const byKw = {};
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!byKw[m.keyword]) byKw[m.keyword] = [];
      byKw[m.keyword].push(m);
    }
    const highlights = [];
    for (let k = 0; k < keywords.length; k++) {
      const kw = keywords[k];
      if (!byKw[kw]) continue;
      let best = byKw[kw][0];
      let bestD = haversineKm(centerLat, centerLng, best.lat, best.lng);
      for (let t = 1; t < byKw[kw].length; t++) {
        const d = haversineKm(centerLat, centerLng, byKw[kw][t].lat, byKw[kw][t].lng);
        if (d < bestD) {
          best = byKw[kw][t];
          bestD = d;
        }
      }
      highlights.push(best);
    }

    results.push({
      id: `r${labelKeys[c]}`,
      center: {
        lat: Math.round(centerLat * 1e6) / 1e6,
        lng: Math.round(centerLng * 1e6) / 1e6,
      },
      radius_km: Math.round(Math.max(maxR, 0.15) * 1000) / 1000,
      keywords: hit.slice().sort(),
      missing_keywords: setDiff(required, hit).sort(),
      coverage: Math.round(coverage * 1000) / 1000,
      score,
      poi_count: members.length,
      pois: members,
      highlights,
      summary: summaryText(hit, meanR, coverage),
    });
  }

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.radius_km - b.radius_km;
  });

  for (let i = 0; i < results.length; i++) {
    results[i].id = `region_${i + 1}`;
    results[i].rank = i + 1;
  }
  return results;
}

export { haversineKm };
