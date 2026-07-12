import { search, PRESETS } from "./search.js";
import { getAmapKey, setAmapKey } from "./config.js";
import { colorForKeyword, scorePercent, formatRadius, escapeHtml } from "./util.js";
import { initMap, renderRegions, focusRegion, renderDetail } from "./map.js";

const state = {
  view: "search", // search | result | detail
  searchMode: "city",
  city: "深圳",
  keywords: ["瑞幸咖啡", "理想汽车"],
  keywordInput: "",
  matchAll: true,
  epsKm: 1.2,
  radius: 3000,
  locationReady: false,
  locationText: "",
  latitude: null,
  longitude: null,
  locating: false,
  searching: false,
  lastSearch: null,
  lastResult: null,
  selectedId: "",
  selectedRegion: null,
};

function $(sel) {
  return document.querySelector(sel);
}

function showView(name) {
  state.view = name;
  document.querySelectorAll("[data-view]").forEach((el) => {
    el.hidden = el.getAttribute("data-view") !== name;
  });
  if (name === "result" && state.lastResult) {
    requestAnimationFrame(() => {
      ensureResultMap();
      paintResultList();
    });
  }
  if (name === "detail" && state.selectedRegion) {
    requestAnimationFrame(() => {
      ensureDetailMap();
      paintDetail();
    });
  }
}

function toast(msg) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2200);
}

function renderKeywordChips() {
  const wrap = $("#keywordChips");
  if (!wrap) return;
  wrap.innerHTML = state.keywords
    .map(
      (kw, i) =>
        `<span class="chip chip-accent">${escapeHtml(kw)}` +
        `<button type="button" class="chip-x" data-index="${i}" aria-label="移除">×</button></span>`
    )
    .join("");
  if (state.keywords.length < 6) {
    wrap.innerHTML += `<button type="button" class="chip chip-add" id="btnAddChip">+ 添加</button>`;
  }
  wrap.querySelectorAll(".chip-x").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-index"));
      state.keywords.splice(idx, 1);
      renderKeywordChips();
      updateSearchBtn();
    });
  });
  const add = $("#btnAddChip");
  if (add) add.addEventListener("click", () => $("#keywordInput")?.focus());
  updateSearchBtn();
}

function renderPresets() {
  const track = $("#presetTrack");
  if (!track) return;
  track.innerHTML = PRESETS.map(
    (p) =>
      `<button type="button" class="preset-card" data-id="${p.id}">` +
      `<span class="preset-title">${escapeHtml(p.title)}</span>` +
      `<span class="preset-sub">${escapeHtml(p.subtitle)}</span></button>`
  ).join("");
  track.querySelectorAll(".preset-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = PRESETS.find((x) => x.id === btn.dataset.id);
      if (!preset) return;
      state.keywords = preset.keywords.slice();
      renderKeywordChips();
      toast(`已填入「${preset.title}」`);
    });
  });
}

function updateSearchBtn() {
  const btn = $("#btnSearch");
  if (!btn) return;
  btn.disabled = state.searching || state.keywords.length < 2;
  btn.textContent = state.searching ? "正在扫描区域…" : "开始发现";
}

function updateModeUI() {
  document.querySelectorAll(".mode-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.mode === state.searchMode);
  });
  const cityBlock = $("#cityBlock");
  const nearbyBlock = $("#nearbyBlock");
  if (cityBlock) cityBlock.hidden = state.searchMode !== "city";
  if (nearbyBlock) nearbyBlock.hidden = state.searchMode !== "nearby";
}

function updateLabels() {
  const eps = $("#epsLabel");
  const rad = $("#radiusLabel");
  if (eps) eps.textContent = `${state.epsKm.toFixed(1)} km`;
  if (rad) rad.textContent = `${(state.radius / 1000).toFixed(1)} km`;
  const locTitle = $("#locationTitle");
  const locText = $("#locationText");
  if (locTitle) locTitle.textContent = state.locationReady ? "当前位置" : "尚未获取定位";
  if (locText) {
    locText.textContent = state.locationReady
      ? state.locationText
      : "授权后搜索你附近的共现区域";
  }
  const radiusRow = $("#radiusRow");
  if (radiusRow) radiusRow.hidden = !state.locationReady;
}

function addKeyword() {
  const input = $("#keywordInput");
  const raw = (input?.value || state.keywordInput || "").trim();
  if (!raw) return;
  if (state.keywords.length >= 6) {
    toast("最多 6 个关键词");
    return;
  }
  if (state.keywords.includes(raw)) {
    toast("已添加");
    if (input) input.value = "";
    return;
  }
  state.keywords.push(raw);
  if (input) input.value = "";
  renderKeywordChips();
}

function onLocate() {
  if (!navigator.geolocation) {
    toast("当前浏览器不支持定位");
    return;
  }
  state.locating = true;
  const btn = $("#btnLocate");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "定位中…";
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.locating = false;
      state.locationReady = true;
      state.latitude = pos.coords.latitude;
      state.longitude = pos.coords.longitude;
      state.locationText = `${state.latitude.toFixed(4)}, ${state.longitude.toFixed(4)}`;
      if (btn) {
        btn.disabled = false;
        btn.textContent = "定位";
      }
      updateLabels();
    },
    () => {
      state.locating = false;
      if (btn) {
        btn.disabled = false;
        btn.textContent = "定位";
      }
      alert("无法获取定位。请允许位置权限，或改用城市搜索。");
    },
    { enableHighAccuracy: true, timeout: 15000 }
  );
}

async function onSearch() {
  if (state.keywords.length < 2) {
    toast("请至少添加 2 个关键词");
    return;
  }
  if (state.searchMode === "city" && !(state.city || "").trim()) {
    toast("请输入城市");
    return;
  }
  if (state.searchMode === "nearby" && !state.locationReady) {
    toast("请先获取定位");
    return;
  }

  const payload = {
    keywords: state.keywords.slice(),
    eps_km: state.epsKm,
    match_mode: state.matchAll ? "all" : "partial",
    min_keywords: 2,
    radius: state.radius,
  };
  if (state.searchMode === "city") {
    payload.city = state.city.trim();
  } else {
    payload.latitude = state.latitude;
    payload.longitude = state.longitude;
  }

  state.searching = true;
  updateSearchBtn();
  const overlay = $("#loadingOverlay");
  if (overlay) overlay.hidden = false;

  try {
    const result = await search(payload);
    state.lastSearch = payload;
    state.lastResult = result;
    state.selectedId = result.regions?.[0]?.id || "";
    state.searching = false;
    updateSearchBtn();
    if (overlay) overlay.hidden = true;
    showView("result");
  } catch (err) {
    state.searching = false;
    updateSearchBtn();
    if (overlay) overlay.hidden = true;
    alert((err && err.message) || "搜索失败，请检查网络与高德 Key");
  }
}

function ensureResultMap() {
  const result = state.lastResult;
  if (!result) return;
  let lat = 22.543;
  let lng = 114.057;
  if (state.lastSearch?.latitude && state.lastSearch?.longitude) {
    lat = state.lastSearch.latitude;
    lng = state.lastSearch.longitude;
  } else if (result.regions?.length) {
    lat = result.regions[0].center.lat;
    lng = result.regions[0].center.lng;
  }
  initMap("resultMap", [lat, lng], 12);
  const selected = state.selectedId || result.regions?.[0]?.id;
  renderRegions(result.regions, selected, result.keywords, (id) => {
    state.selectedId = id;
    paintResultList();
    const region = result.regions.find((r) => r.id === id);
    if (region) {
      renderRegions(result.regions, id, result.keywords, (nid) => {
        state.selectedId = nid;
        paintResultList();
        const r2 = result.regions.find((x) => x.id === nid);
        if (r2) focusRegion(r2);
      });
      focusRegion(region);
    }
  });
}

function paintResultList() {
  const result = state.lastResult;
  if (!result) return;

  const stats = $("#resultStats");
  if (stats) {
    stats.innerHTML =
      `<span class="stats-num">${result.regions.length}</span>` +
      `<span class="stats-label">个共现区域</span>` +
      `<span class="stats-meta">${result.total_pois || 0} 个 POI · ${escapeHtml(
        (result.keywords || []).join(" · ")
      )}</span>`;
  }

  const list = $("#regionList");
  if (!list) return;

  if (!result.regions.length) {
    list.innerHTML =
      `<div class="empty">` +
      `<p class="empty-title">未发现共现区域</p>` +
      `<p class="empty-desc">可放宽商圈半径、关闭「必须全部包含」，或换更具体的品牌名再试。</p></div>`;
    return;
  }

  const keywords = result.keywords || [];
  list.innerHTML = result.regions
    .map((r) => {
      const sel = r.id === state.selectedId ? " selected" : "";
      const score = `${scorePercent(r.score)}%`;
      const kws = (r.keywords || [])
        .map(
          (kw) =>
            `<span class="kw-dot" style="background:${colorForKeyword(kw, keywords)}">${escapeHtml(
              kw
            )}</span>`
        )
        .join("");
      return (
        `<article class="region-card${sel}" data-id="${r.id}">` +
        `<div class="region-top">` +
        `<div class="rank">${r.rank}</div>` +
        `<div class="region-main">` +
        `<h3 class="region-title">区域 ${r.rank}</h3>` +
        `<p class="region-summary">${escapeHtml(r.summary || "")}</p>` +
        `</div>` +
        `<span class="score-pill">${score}</span>` +
        `</div>` +
        `<div class="kw-row">${kws}</div>` +
        `<div class="region-foot">` +
        `<span>${r.poi_count} 个地点 · 半径 ${formatRadius(r.radius_km)}</span>` +
        `<button type="button" class="detail-link" data-detail="${r.id}">详情 ›</button>` +
        `</div></article>`
      );
    })
    .join("");

  list.querySelectorAll(".region-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-detail]")) return;
      const id = card.dataset.id;
      state.selectedId = id;
      paintResultList();
      const region = result.regions.find((r) => r.id === id);
      if (region) {
        renderRegions(result.regions, id, result.keywords, (nid) => {
          state.selectedId = nid;
          paintResultList();
          const r2 = result.regions.find((x) => x.id === nid);
          if (r2) focusRegion(r2);
        });
        focusRegion(region);
      }
    });
  });

  list.querySelectorAll("[data-detail]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openDetail(btn.getAttribute("data-detail"));
    });
  });
}

function openDetail(id) {
  const result = state.lastResult;
  if (!result) return;
  const region = result.regions.find((r) => r.id === id);
  if (!region) {
    toast("区域不存在");
    return;
  }
  state.selectedRegion = region;
  state.selectedId = id;
  showView("detail");
}

function ensureDetailMap() {
  const r = state.selectedRegion;
  if (!r) return;
  initMap("detailMap", [r.center.lat, r.center.lng], 14);
  renderDetail(r);
}

function paintDetail() {
  const r = state.selectedRegion;
  const result = state.lastResult;
  if (!r) return;
  const keywords = (result && result.keywords) || r.keywords || [];

  const head = $("#detailHead");
  if (head) {
    head.innerHTML =
      `<h2>区域 ${r.rank}</h2>` +
      `<p>${escapeHtml(r.summary || "")}</p>` +
      `<div class="detail-meta">` +
      `<span class="score-pill">${scorePercent(r.score)}%</span>` +
      `<span class="caption">${r.poi_count} 地点 · ${formatRadius(r.radius_km)}</span>` +
      `<button type="button" class="btn-ghost" id="btnCopyCoord">复制坐标</button>` +
      `<a class="btn-ghost" target="_blank" rel="noopener" href="https://uri.amap.com/marker?position=${r.center.lng},${r.center.lat}&name=区域${r.rank}">在高德打开</a>` +
      `</div>`;
    $("#btnCopyCoord")?.addEventListener("click", async () => {
      const text = `${r.center.lat},${r.center.lng}`;
      try {
        await navigator.clipboard.writeText(text);
        toast("已复制坐标");
      } catch (_) {
        prompt("复制坐标：", text);
      }
    });
  }

  const poiList = $("#poiList");
  if (poiList) {
    const items = r.pois || [];
    if (!items.length) {
      poiList.innerHTML = `<p class="empty-desc">暂无 POI</p>`;
    } else {
      poiList.innerHTML = items
        .map(
          (p) =>
            `<div class="poi-item">` +
            `<span class="kw-dot" style="background:${colorForKeyword(p.keyword, keywords)}">${escapeHtml(
              p.keyword
            )}</span>` +
            `<div class="poi-body">` +
            `<div class="poi-name">${escapeHtml(p.name)}</div>` +
            `<div class="poi-addr">${escapeHtml(p.address || "")}</div>` +
            `</div></div>`
        )
        .join("");
    }
  }
}

function bindSettings() {
  const panel = $("#settingsPanel");
  const openBtn = $("#btnSettings");
  const closeBtn = $("#btnCloseSettings");
  const input = $("#amapKeyInput");
  const saveBtn = $("#btnSaveKey");
  const clearBtn = $("#btnClearKey");

  openBtn?.addEventListener("click", () => {
    if (input) input.value = getAmapKey();
    if (panel) panel.hidden = false;
  });
  closeBtn?.addEventListener("click", () => {
    if (panel) panel.hidden = true;
  });
  saveBtn?.addEventListener("click", () => {
    setAmapKey(input?.value || "");
    toast("Key 已保存到本机");
    if (panel) panel.hidden = true;
  });
  clearBtn?.addEventListener("click", () => {
    setAmapKey("");
    if (input) input.value = getAmapKey();
    toast("已恢复默认 Key");
  });
}

function bind() {
  document.querySelectorAll(".mode-item").forEach((el) => {
    el.addEventListener("click", () => {
      state.searchMode = el.dataset.mode;
      updateModeUI();
    });
  });

  $("#cityInput")?.addEventListener("input", (e) => {
    state.city = e.target.value;
  });

  $("#keywordInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  });
  $("#btnAddKeyword")?.addEventListener("click", addKeyword);
  $("#btnLocate")?.addEventListener("click", onLocate);
  $("#btnSearch")?.addEventListener("click", onSearch);

  $("#matchAll")?.addEventListener("change", (e) => {
    state.matchAll = e.target.checked;
  });

  $("#epsRange")?.addEventListener("input", (e) => {
    state.epsKm = Number(e.target.value);
    updateLabels();
  });
  $("#radiusRange")?.addEventListener("input", (e) => {
    state.radius = Number(e.target.value);
    updateLabels();
  });

  $("#btnBackResult")?.addEventListener("click", () => showView("search"));
  $("#btnBackDetail")?.addEventListener("click", () => showView("result"));

  bindSettings();
}

function init() {
  const cityInput = $("#cityInput");
  if (cityInput) cityInput.value = state.city;
  const matchAll = $("#matchAll");
  if (matchAll) matchAll.checked = state.matchAll;
  const eps = $("#epsRange");
  if (eps) eps.value = String(state.epsKm);
  const rad = $("#radiusRange");
  if (rad) rad.value = String(state.radius);

  renderKeywordChips();
  renderPresets();
  updateModeUI();
  updateLabels();
  updateSearchBtn();
  bind();
  showView("search");
}

init();
