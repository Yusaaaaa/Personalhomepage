/**
 * Client-side config for the static web tool.
 * Amap Web Service key is visible in the browser (personal-tool level).
 * Override via Settings UI → stored in localStorage.
 */

const STORAGE_KEY = "mp-amap-key";

const DEFAULTS = {
  // Web 服务 Key（高德控制台 → Web服务）
  amapKey: "489518be45d4ca58a9bcb2e9ad39cf56",
  maxPages: 5,
  pageSize: 25,
};

export function getAmapKey() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch (_) {
    /* ignore */
  }
  return DEFAULTS.amapKey;
}

export function setAmapKey(key) {
  try {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (_) {
    /* ignore */
  }
}

export function getConfig() {
  return {
    amapKey: getAmapKey(),
    maxPages: DEFAULTS.maxPages,
    pageSize: DEFAULTS.pageSize,
  };
}

export { DEFAULTS, STORAGE_KEY };
