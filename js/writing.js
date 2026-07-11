/**
 * Writing index (homepage top 5 / full list) + single post renderer
 */
(function () {
  "use strict";

  const INDEX_URL = "data/writing-index.json";
  const HOME_LIMIT = 5;

  function t(key, fallback) {
    return window.HF_I18N ? window.HF_I18N.t(key) : fallback || key;
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
    // Relative to site root (works under /Personalhomepage/ when pages are at root)
    return path;
  }

  async function loadIndex() {
    const res = await fetch(resolveUrl(INDEX_URL), { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load writing index");
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

  function cardHtml(post) {
    const href = `post.html?slug=${encodeURIComponent(post.slug)}`;
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
        <span class="writing-card-more" data-i18n="writing.readMore">${escapeHtml(
          t("writing.readMore", "Read more →")
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

  async function renderList(container, limit) {
    if (!container) return;
    try {
      const posts = await loadIndex();
      const slice =
        typeof limit === "number" ? posts.slice(0, limit) : posts;
      if (!slice.length) {
        setEmpty(container, t("writing.empty", "No notes yet."));
        return;
      }
      container.innerHTML = slice.map(cardHtml).join("");
      reapplyI18n(container);
      revealNew(container);
    } catch (err) {
      console.error(err);
      setEmpty(
        container,
        t("writing.error", "Could not load notes. Try again later.")
      );
    }
  }

  async function renderPost() {
    const titleEl = document.getElementById("postTitle");
    const metaEl = document.getElementById("postMeta");
    const bodyEl = document.getElementById("postBody");
    if (!bodyEl) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    if (!slug) {
      bodyEl.innerHTML = `<p class="writing-empty">${escapeHtml(
        t("writing.missingSlug", "No article selected.")
      )}</p>`;
      return;
    }

    try {
      const posts = await loadIndex();
      const post = posts.find((p) => p.slug === slug);
      if (!post) {
        bodyEl.innerHTML = `<p class="writing-empty">${escapeHtml(
          t("writing.notFound", "Article not found.")
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
      bodyEl.innerHTML = `<p class="writing-empty">${escapeHtml(
        t("writing.error", "Could not load notes. Try again later.")
      )}</p>`;
    }
  }

  function boot() {
    const homeList = document.getElementById("writingHomeList");
    const fullList = document.getElementById("writingFullList");
    const postBody = document.getElementById("postBody");

    if (homeList) renderList(homeList, HOME_LIMIT);
    if (fullList) renderList(fullList, null);
    if (postBody) renderPost();

    window.addEventListener("languagechange", () => {
      if (homeList) renderList(homeList, HOME_LIMIT);
      if (fullList) renderList(fullList, null);
      // Post body language is content-native; only reformat date
      if (postBody && document.getElementById("postMeta")) {
        const time = document.querySelector("#postMeta time");
        if (time && time.getAttribute("datetime")) {
          time.textContent = formatDate(time.getAttribute("datetime"));
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
