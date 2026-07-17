/**
 * Simple updates feed: date + note + links
 * Homepage shows latest HOME_LIMIT; updates.html shows all.
 */
(function () {
  "use strict";

  const HOME_LIMIT = 10;
  const INDEX_URL = "data/updates.json";

  function t(key, fallback) {
    return window.HF_I18N ? window.HF_I18N.t(key) : fallback || key;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function sortNewestFirst(items) {
    return items.slice().sort(function (a, b) {
      const da = a.date || "";
      const db = b.date || "";
      if (da !== db) return db.localeCompare(da);
      return 0;
    });
  }

  function linkHtml(link) {
    if (!link || !link.href || !link.label) return "";
    const external = /^https?:\/\//i.test(link.href);
    const rel = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return (
      '<a href="' +
      escapeHtml(link.href) +
      '"' +
      rel +
      ">" +
      escapeHtml(link.label) +
      "</a>"
    );
  }

  function itemHtml(item) {
    const date = item.date || "";
    const text = item.text || "";
    const links = Array.isArray(item.links) ? item.links : [];
    const linkPart = links
      .map(linkHtml)
      .filter(Boolean)
      .join(' <span class="news-link-sep">·</span> ');
    const body =
      escapeHtml(text) +
      (linkPart ? (text ? " " : "") + linkPart : "");
    return (
      '<li class="news-item">' +
      '<strong class="news-date"><time datetime="' +
      escapeHtml(date) +
      '">' +
      escapeHtml(date) +
      "</time></strong>" +
      '<span class="news-body">' +
      body +
      "</span></li>"
    );
  }

  function setMessage(listEl, message) {
    listEl.innerHTML =
      '<li class="news-empty">' + escapeHtml(message) + "</li>";
  }

  function reveal(el) {
    if (!el) return;
    el.classList.add("is-visible");
    el.querySelectorAll(".reveal").forEach(function (node) {
      node.classList.add("is-visible");
    });
  }

  async function loadItems() {
    const res = await fetch(INDEX_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load updates");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Invalid updates data");
    return sortNewestFirst(data);
  }

  async function renderHome() {
    const listEl = document.getElementById("updatesHomeList");
    if (!listEl) return;

    const footer = document.getElementById("updatesHomeFooter");
    try {
      const items = await loadItems();
      if (!items.length) {
        setMessage(listEl, t("updates.empty", "No updates yet."));
        if (footer) footer.hidden = true;
        return;
      }
      const slice = items.slice(0, HOME_LIMIT);
      listEl.innerHTML = slice.map(itemHtml).join("");
      if (footer) {
        footer.hidden = items.length <= HOME_LIMIT;
      }
      reveal(listEl);
      if (footer) reveal(footer);
    } catch (err) {
      console.error(err);
      setMessage(
        listEl,
        t("updates.error", "Could not load updates. Try again later.")
      );
      if (footer) footer.hidden = true;
    }
  }

  async function renderFull() {
    const listEl = document.getElementById("updatesFullList");
    if (!listEl) return;

    try {
      const items = await loadItems();
      if (!items.length) {
        setMessage(listEl, t("updates.empty", "No updates yet."));
        return;
      }
      listEl.innerHTML = items.map(itemHtml).join("");
      reveal(listEl);
    } catch (err) {
      console.error(err);
      setMessage(
        listEl,
        t("updates.error", "Could not load updates. Try again later.")
      );
    }
  }

  function init() {
    if (document.getElementById("updatesHomeList")) {
      renderHome();
    }
    if (document.getElementById("updatesFullList")) {
      renderFull();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
