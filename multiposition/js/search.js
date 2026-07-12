import { searchAll } from "./amap.js";
import { findRegions } from "./cluster.js";

export const PRESETS = [
  {
    id: "rent",
    title: "理想租房",
    subtitle: "咖啡 · 健身 · 超市",
    keywords: ["瑞幸咖啡", "健身房", "超市"],
  },
  {
    id: "ev",
    title: "新能源出行",
    subtitle: "充电 · 咖啡 · 商场",
    keywords: ["理想汽车", "瑞幸咖啡", "商场"],
  },
  {
    id: "work",
    title: "高效办公",
    subtitle: "咖啡 · 简餐 · 打印",
    keywords: ["咖啡", "简餐", "打印店"],
  },
  {
    id: "weekend",
    title: "周末休闲",
    subtitle: "公园 · 咖啡 · 书店",
    keywords: ["公园", "咖啡", "书店"],
  },
];

function cleanKeywords(list) {
  const seen = {};
  const out = [];
  for (let i = 0; i < (list || []).length; i++) {
    const k = String(list[i] || "").trim();
    if (!k || seen[k]) continue;
    seen[k] = true;
    out.push(k);
  }
  return out;
}

/**
 * @param {{
 *   keywords: string[],
 *   city?: string,
 *   latitude?: number,
 *   longitude?: number,
 *   radius?: number,
 *   eps_km?: number,
 *   match_mode?: 'all'|'partial',
 *   min_keywords?: number,
 * }} payload
 */
export async function search(payload) {
  const keywords = cleanKeywords(payload.keywords);
  if (keywords.length < 2) {
    throw new Error("至少需要 2 个关键词");
  }

  const hasCity = !!(payload.city && String(payload.city).trim());
  const hasLoc = payload.latitude != null && payload.longitude != null;
  if (!hasCity && !hasLoc) {
    throw new Error("请提供城市或定位");
  }

  const options = {
    radius: payload.radius || 3000,
  };
  if (hasCity) options.city = String(payload.city).trim();
  if (hasLoc) {
    options.location = `${payload.longitude},${payload.latitude}`;
  }

  const { resultsByKw, allPois } = await searchAll(keywords, options);

  const regions = findRegions(allPois, keywords, {
    epsKm: payload.eps_km != null ? payload.eps_km : 1.2,
    matchMode: payload.match_mode || "all",
    minKeywords: payload.min_keywords != null ? payload.min_keywords : 2,
  });

  const poiCounts = {};
  for (let i = 0; i < keywords.length; i++) {
    const kw = keywords[i];
    poiCounts[kw] = (resultsByKw[kw] || []).length;
  }

  return {
    keywords,
    poi_counts: poiCounts,
    total_pois: allPois.length,
    regions,
    meta: {
      city: options.city || null,
      location: options.location || null,
      radius: options.radius,
      eps_km: payload.eps_km != null ? payload.eps_km : 1.2,
      match_mode: payload.match_mode || "all",
      region_count: regions.length,
    },
  };
}

export function getPresets() {
  return { presets: PRESETS };
}
