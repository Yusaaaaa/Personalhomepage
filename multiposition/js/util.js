/** Shared helpers */

export const KEYWORD_COLORS = [
  "#0A84FF",
  "#30D158",
  "#FF9F0A",
  "#BF5AF2",
  "#64D2FF",
  "#FF375F",
  "#AC8E68",
  "#5E5CE6",
];

export function colorForKeyword(keyword, keywords) {
  const idx = Math.max(0, keywords.indexOf(keyword));
  return KEYWORD_COLORS[idx % KEYWORD_COLORS.length];
}

export function scorePercent(score) {
  if (score == null) return 0;
  return Math.round(Number(score) * 100);
}

export function formatRadius(km) {
  if (km == null) return "";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
