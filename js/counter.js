/**
 * Site visit counter (page-footer). Counts once per browser session on the live site.
 */
(function () {
  "use strict";

  const API = "https://countapi.mileshilliard.com/api/v1";
  const KEY = "yusaaaaa-github-io-personalhomepage";
  const SESSION_FLAG = "hf-visit-counted";

  function isLiveHost() {
    return location.hostname === "yusaaaaa.github.io";
  }

  function formatCount(n) {
    try {
      const lang = window.HF_I18N ? window.HF_I18N.getLang() : document.documentElement.lang || "en";
      const locale =
        lang === "zh" || lang === "zh-Hant" ? "zh-Hans" : lang === "ja" ? "ja" : "en";
      return n.toLocaleString(locale);
    } catch (_) {
      return String(n);
    }
  }

  function render(n) {
    const nodes = document.querySelectorAll("[data-visit-count]");
    if (!nodes.length) return;
    const text = formatCount(n);
    nodes.forEach((el) => {
      el.textContent = text;
    });
    document.querySelectorAll(".footer-visits").forEach((el) => {
      el.hidden = false;
    });
  }

  async function run() {
    let already = false;
    try {
      already = sessionStorage.getItem(SESSION_FLAG) === "1";
    } catch (_) {
      already = false;
    }

    const action = isLiveHost() && !already ? "hit" : "get";
    const res = await fetch(API + "/" + action + "/" + encodeURIComponent(KEY), {
      cache: "no-store",
    });
    if (!res.ok) return;
    const data = await res.json();
    const n = Number(data && data.value);
    if (!Number.isFinite(n)) return;
    if (action === "hit") {
      try {
        sessionStorage.setItem(SESSION_FLAG, "1");
      } catch (_) {
        /* ignore */
      }
    }
    render(n);
  }

  function boot() {
    run().catch(function () {
      /* keep footer visits hidden */
    });
    window.addEventListener("languagechange", function () {
      const el = document.querySelector("[data-visit-count]");
      const n = el && parseInt(String(el.textContent).replace(/[^\d]/g, ""), 10);
      if (Number.isFinite(n)) render(n);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
