import { getConfig } from "./config.js";

const TEXT_URL = "https://restapi.amap.com/v3/place/text";
const AROUND_URL = "https://restapi.amap.com/v3/place/around";

let jsonpSeq = 0;

function buildQuery(params) {
  const parts = [];
  Object.keys(params).forEach((k) => {
    if (params[k] == null || params[k] === "") return;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`);
  });
  return parts.join("&");
}

/** JSONP — works when REST CORS blocks browser fetch */
function requestJsonp(url, data, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const cbName = `__mp_amap_cb_${Date.now()}_${++jsonpSeq}`;
    const script = document.createElement("script");
    let timer = null;
    const cleanup = () => {
      if (timer) clearTimeout(timer);
      try {
        delete window[cbName];
      } catch (_) {
        window[cbName] = undefined;
      }
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    window[cbName] = (payload) => {
      cleanup();
      resolve(payload || {});
    };

    timer = setTimeout(() => {
      cleanup();
      reject(new Error("高德请求超时"));
    }, timeoutMs);

    const qs = buildQuery({ ...data, callback: cbName, output: "JSON" });
    script.src = `${url}?${qs}`;
    script.onerror = () => {
      cleanup();
      reject(new Error("高德脚本加载失败，请检查网络或 Key"));
    };
    document.head.appendChild(script);
  });
}

async function requestAmap(url, data) {
  // Prefer JSONP for browser compatibility with Amap Web Service
  return requestJsonp(url, data);
}

function dedupe(pois) {
  const seen = {};
  const out = [];
  for (let i = 0; i < pois.length; i++) {
    const p = pois[i];
    const loc = p.location || "";
    const name = (p.name || "").trim();
    let key;
    try {
      const parts = loc.split(",");
      const lng = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      key = `${name}|${lat.toFixed(4)}|${lng.toFixed(4)}`;
    } catch (e) {
      key = `${name}|${loc}`;
    }
    if (seen[key]) continue;
    seen[key] = true;
    out.push(p);
  }
  return out;
}

/**
 * @param {string} keyword
 * @param {{ city?: string, location?: string, radius?: number }} options
 */
export async function searchKeyword(keyword, options) {
  options = options || {};
  const cfg = getConfig();
  const key = cfg.amapKey;
  if (!key || key.indexOf("YOUR_") === 0) {
    throw new Error("请先配置高德 Web 服务 Key（设置面板或 js/config.js）");
  }

  const useAround = !!options.location;
  const url = useAround ? AROUND_URL : TEXT_URL;
  const maxPages = cfg.maxPages || 5;
  const pageSize = cfg.pageSize || 25;
  const all = [];

  for (let page = 1; page <= maxPages; page++) {
    const data = {
      key,
      keywords: keyword,
      offset: pageSize,
      page,
      extensions: "all",
    };
    if (options.city) {
      data.city = options.city;
      data.citylimit = true;
    }
    if (useAround) {
      data.location = options.location;
      data.radius = options.radius || 3000;
    }

    const body = await requestAmap(url, data);

    if (String(body.status) !== "1") {
      const info = body.info || "unknown";
      if (page === 1 && all.length === 0) {
        if (info === "OK" || info === "ok" || String(body.count) === "0") {
          break;
        }
        throw new Error(`高德返回错误: ${info}`);
      }
      break;
    }

    const pois = body.pois || [];
    if (!pois.length) break;

    for (let i = 0; i < pois.length; i++) {
      pois[i]._keyword = keyword;
    }
    all.push.apply(all, pois);

    if (pois.length < pageSize) break;
  }

  return dedupe(all);
}

export async function searchAll(keywords, options) {
  const resultsByKw = {};
  const allPois = [];

  for (let i = 0; i < keywords.length; i++) {
    const kw = keywords[i];
    const pois = await searchKeyword(kw, options);
    resultsByKw[kw] = pois;
    for (let j = 0; j < pois.length; j++) {
      allPois.push(pois[j]);
    }
  }

  return { resultsByKw, allPois };
}
