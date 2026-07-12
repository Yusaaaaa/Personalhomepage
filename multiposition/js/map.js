/**
 * Leaflet map helpers.
 * Uses Gaode raster tiles so GCJ-02 POI coords align better than OSM.
 */

let map = null;
let layerGroup = null;

export function initMap(containerId, center = [22.543, 114.057], zoom = 12) {
  if (map) {
    map.remove();
    map = null;
    layerGroup = null;
  }

  map = L.map(containerId, {
    zoomControl: true,
    attributionControl: true,
  }).setView(center, zoom);

  // Gaode web tiles (GCJ-02 aligned)
  L.tileLayer(
    "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    {
      subdomains: ["1", "2", "3", "4"],
      maxZoom: 18,
      attribution: '&copy; <a href="https://lbs.amap.com/" target="_blank" rel="noopener">高德地图</a>',
    }
  ).addTo(map);

  layerGroup = L.layerGroup().addTo(map);
  setTimeout(() => map.invalidateSize(), 80);
  return map;
}

export function getMap() {
  return map;
}

export function clearLayers() {
  if (layerGroup) layerGroup.clearLayers();
}

/**
 * @param {object[]} regions
 * @param {string} selectedId
 * @param {string[]} keywords
 * @param {(id: string) => void} onRegionClick
 */
export function renderRegions(regions, selectedId, keywords, onRegionClick) {
  if (!map || !layerGroup) return;
  clearLayers();

  const bounds = [];

  (regions || []).forEach((r, i) => {
    const isSel = r.id === selectedId || (!selectedId && i === 0);
    const circle = L.circle([r.center.lat, r.center.lng], {
      radius: Math.max((r.radius_km || 0.5) * 1000, 200),
      color: isSel ? "#0A84FF" : "rgba(255,255,255,0.35)",
      weight: isSel ? 2 : 1,
      fillColor: isSel ? "#0A84FF" : "#ffffff",
      fillOpacity: isSel ? 0.18 : 0.06,
    });
    circle.on("click", () => onRegionClick && onRegionClick(r.id));
    circle.addTo(layerGroup);
    bounds.push([r.center.lat, r.center.lng]);

    if (isSel) {
      (r.pois || []).slice(0, 40).forEach((p) => {
        const m = L.circleMarker([p.lat, p.lng], {
          radius: 6,
          color: "#fff",
          weight: 1,
          fillColor: "#0A84FF",
          fillOpacity: 0.9,
        });
        m.bindPopup(`<strong>${escape(p.name)}</strong><br/><span style="opacity:.7">${escape(p.keyword)}</span>`);
        m.addTo(layerGroup);
        bounds.push([p.lat, p.lng]);
      });
    }
  });

  if (bounds.length) {
    try {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } catch (_) {
      /* ignore */
    }
  }
  setTimeout(() => map && map.invalidateSize(), 50);
}

export function focusRegion(region) {
  if (!map || !region) return;
  map.setView([region.center.lat, region.center.lng], 14, { animate: true });
}

export function renderDetail(region) {
  if (!map || !layerGroup || !region) return;
  clearLayers();

  L.circle([region.center.lat, region.center.lng], {
    radius: Math.max((region.radius_km || 0.5) * 1000, 200),
    color: "#0A84FF",
    weight: 2,
    fillColor: "#0A84FF",
    fillOpacity: 0.16,
  }).addTo(layerGroup);

  const bounds = [[region.center.lat, region.center.lng]];
  (region.pois || []).forEach((p) => {
    const m = L.circleMarker([p.lat, p.lng], {
      radius: 7,
      color: "#fff",
      weight: 1,
      fillColor: "#30D158",
      fillOpacity: 0.95,
    });
    m.bindPopup(
      `<strong>${escape(p.name)}</strong><br/>` +
        `<span style="opacity:.7">${escape(p.keyword)}</span><br/>` +
        `<span style="opacity:.55;font-size:12px">${escape(p.address || "")}</span>`
    );
    m.addTo(layerGroup);
    bounds.push([p.lat, p.lng]);
  });

  try {
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 16 });
  } catch (_) {
    map.setView([region.center.lat, region.center.lng], 14);
  }
  setTimeout(() => map && map.invalidateSize(), 50);
}

function escape(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
