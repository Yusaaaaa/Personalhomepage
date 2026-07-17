/**
 * Multi-collection content: homepage top 5 / full list / single post
 * Collections: ai_views | writing | notes | updates
 */
(function () {
  "use strict";

  const HOME_LIMIT = 5;

  const COLLECTIONS = {
    ai_views: {
      id: "ai_views",
      index: "data/ai-views-index.json",
      listPage: "ai-views.html",
      i18n: "aiViews",
      homeListId: "aiViewsHomeList",
      fullListId: "aiViewsFullList",
      navSelector: '[data-nav-collection="ai_views"]',
    },
    writing: {
      id: "writing",
      index: "data/writing-index.json",
      listPage: "writing.html",
      i18n: "writing",
      homeListId: "writingHomeList",
      fullListId: "writingFullList",
      navSelector: '[data-nav-collection="writing"]',
    },
    notes: {
      id: "notes",
      index: "data/notes-index.json",
      listPage: "notes.html",
      i18n: "notes",
      homeListId: "notesHomeList",
      fullListId: "notesFullList",
      navSelector: '[data-nav-collection="notes"]',
    },
    updates: {
      id: "updates",
      index: "data/updates-index.json",
      listPage: "updates.html",
      i18n: "updates",
      homeListId: "updatesHomeList",
      fullListId: "updatesFullList",
      navSelector: '[data-nav-collection="updates"]',
    },
  };

  function t(key, fallback) {
    return window.HF_I18N ? window.HF_I18N.t(key) : fallback || key;
  }

  function i18nKey(cfg, suffix) {
    return cfg.i18n + "." + suffix;
  }

  function formatDate(iso) {
    if (!iso) return "";
    const parts = iso.split("-").map(Number);
    if (parts.length < 3 || parts.some((n) => !n)) return iso;
    const [y, m, d] = parts;
    const lang = window.HF_I18N ? window.HF_I18N.getLang() : "en";
    try {
      return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(
        lang === "zh" ? "zh-CN" : lang === "ja" ? "ja-JP" : "en-US",
        { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }
      );
    } catch (_) {
      return iso;
    }
  }

  function resolveUrl(path) {
    return path;
  }

  async function loadIndex(cfg) {
    const res = await fetch(resolveUrl(cfg.index), { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load index: " + cfg.index);
    return res.json();
  }

  function parseFrontmatter(text) {
    if (!text.startsWith("---")) {
      return { meta: {}, body: text };
    }
    const end = text.indexOf("\n---", 3);
    if (end === -1) return { meta: {}, body: text };
    const raw = text.slice(3, end).trim();
    const body = text.slice(end + 4).replace(/^\s*\n/, "");
    const meta = {};
    raw.split("\n").forEach((line) => {
      const i = line.indexOf(":");
      if (i === -1) return;
      const key = line.slice(0, i).trim().toLowerCase();
      let value = line.slice(i + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (key) meta[key] = value;
    });
    return { meta, body };
  }

  function cardHtml(cfg, post) {
    const href =
      "post.html?collection=" +
      encodeURIComponent(cfg.id) +
      "&slug=" +
      encodeURIComponent(post.slug);
    const date = formatDate(post.date);
    const summary = post.summary
      ? `<p class="writing-card-summary">${escapeHtml(post.summary)}</p>`
      : "";
    return `
      <a class="writing-card card reveal" href="${href}">
        <div class="writing-card-meta">
          ${date ? `<time datetime="${escapeHtml(post.date)}">${escapeHtml(date)}</time>` : ""}
        </div>
        <h3 class="writing-card-title">${escapeHtml(post.title)}</h3>
        ${summary}
        <span class="writing-card-more" data-i18n="${i18nKey(cfg, "readMore")}">${escapeHtml(
          t(i18nKey(cfg, "readMore"), "Read more →")
        )}</span>
      </a>
    `;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setEmpty(el, message) {
    el.innerHTML = `<p class="writing-empty">${escapeHtml(message)}</p>`;
  }

  function reapplyI18n(root) {
    if (!window.HF_I18N) return;
    const lang = window.HF_I18N.getLang();
    root.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (key) node.textContent = window.HF_I18N.t(key, lang);
    });
  }

  function revealNew(root) {
    root.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("is-visible");
    });
  }

  async function renderList(cfg, container, limit) {
    if (!container) return;
    try {
      const posts = await loadIndex(cfg);
      const slice =
        typeof limit === "number" ? posts.slice(0, limit) : posts;
      if (!slice.length) {
        setEmpty(container, t(i18nKey(cfg, "empty"), "No notes yet."));
        return;
      }
      container.innerHTML = slice.map((p) => cardHtml(cfg, p)).join("");
      reapplyI18n(container);
      revealNew(container);
    } catch (err) {
      console.error(err);
      setEmpty(
        container,
        t(i18nKey(cfg, "error"), "Could not load content. Try again later.")
      );
    }
  }

  function resolveCollectionFromParams() {
    const params = new URLSearchParams(window.location.search);
    const raw = (params.get("collection") || "").trim();
    if (raw && COLLECTIONS[raw]) return COLLECTIONS[raw];
    // Legacy: old links without collection → try ai_views then others
    return null;
  }

  async function findPostAcrossCollections(slug) {
    for (const cfg of Object.values(COLLECTIONS)) {
      try {
        const posts = await loadIndex(cfg);
        const post = posts.find((p) => p.slug === slug);
        if (post) return { cfg, post };
      } catch (_) {
        /* try next */
      }
    }
    return null;
  }

  async function renderPost() {
    const titleEl = document.getElementById("postTitle");
    const metaEl = document.getElementById("postMeta");
    const bodyEl = document.getElementById("postBody");
    const backLink = document.getElementById("postBackLink");
    if (!bodyEl) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    let cfg = resolveCollectionFromParams();

    if (!slug) {
      const prefix = cfg ? cfg.i18n : "writing";
      bodyEl.innerHTML = `<p class="writing-empty">${escapeHtml(
        t(prefix + ".missingSlug", "No article selected.")
      )}</p>`;
      return;
    }

    try {
      let post = null;
      if (cfg) {
        const posts = await loadIndex(cfg);
        post = posts.find((p) => p.slug === slug) || null;
      } else {
        const found = await findPostAcrossCollections(slug);
        if (found) {
          cfg = found.cfg;
          post = found.post;
        } else {
          cfg = COLLECTIONS.writing;
        }
      }

      if (!cfg) cfg = COLLECTIONS.writing;

      if (backLink) {
        backLink.href = cfg.listPage;
        backLink.setAttribute("data-i18n", i18nKey(cfg, "backList"));
        backLink.textContent = t(i18nKey(cfg, "backList"), "← All");
      }

      document.querySelectorAll("[data-nav-collection]").forEach((a) => {
        a.classList.toggle(
          "is-active",
          a.getAttribute("data-nav-collection") === cfg.id
        );
      });

      if (!post) {
        bodyEl.innerHTML = `<p class="writing-empty">${escapeHtml(
          t(i18nKey(cfg, "notFound"), "Article not found.")
        )}</p>`;
        return;
      }

      const res = await fetch(resolveUrl(post.file), { cache: "no-cache" });
      if (!res.ok) throw new Error("Failed to load markdown");
      const raw = await res.text();
      const { meta, body } = parseFrontmatter(raw);
      const title = meta.title || post.title;
      const date = meta.date || post.date;

      if (titleEl) titleEl.textContent = title;
      if (metaEl) {
        metaEl.innerHTML = date
          ? `<time datetime="${escapeHtml(date)}">${escapeHtml(
              formatDate(date)
            )}</time>`
          : "";
      }

      document.title = `${title} · Haowei Fan`;

      if (typeof marked !== "undefined") {
        marked.setOptions({ gfm: true, breaks: true });
        bodyEl.innerHTML = marked.parse(body);
      } else {
        bodyEl.innerHTML = `<pre class="prose-fallback">${escapeHtml(body)}</pre>`;
      }
    } catch (err) {
      console.error(err);
      const prefix = (cfg && cfg.i18n) || "writing";
      bodyEl.innerHTML = `<p class="writing-empty">${escapeHtml(
        t(prefix + ".error", "Could not load content. Try again later.")
      )}</p>`;
    }
  }

  function boot() {
    const listJobs = [];

    Object.values(COLLECTIONS).forEach((cfg) => {
      const home = document.getElementById(cfg.homeListId);
      const full = document.getElementById(cfg.fullListId);
      if (home) listJobs.push({ cfg, el: home, limit: HOME_LIMIT });
      if (full) listJobs.push({ cfg, el: full, limit: null });
    });

    // data-collection attribute support
    document.querySelectorAll("[data-collection][data-list]").forEach((el) => {
      const id = el.getAttribute("data-collection");
      const mode = el.getAttribute("data-list"); // home | full
      const cfg = COLLECTIONS[id];
      if (!cfg) return;
      const limit = mode === "home" ? HOME_LIMIT : null;
      if (!listJobs.some((j) => j.el === el)) {
        listJobs.push({ cfg, el, limit });
      }
    });

    listJobs.forEach(({ cfg, el, limit }) => renderList(cfg, el, limit));

    const postBody = document.getElementById("postBody");
    if (postBody) renderPost();

    window.addEventListener("languagechange", () => {
      listJobs.forEach(({ cfg, el, limit }) => renderList(cfg, el, limit));
      if (postBody && document.getElementById("postMeta")) {
        const time = document.querySelector("#postMeta time");
        if (time && time.getAttribute("datetime")) {
          time.textContent = formatDate(time.getAttribute("datetime"));
        }
        const backLink = document.getElementById("postBackLink");
        if (backLink && backLink.getAttribute("data-i18n")) {
          backLink.textContent = t(backLink.getAttribute("data-i18n"));
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
