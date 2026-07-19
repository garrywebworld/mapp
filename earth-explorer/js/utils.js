export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function formatNumber(value) {
  if (!Number.isFinite(value)) return "Not available";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function titleCase(value) {
  return String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function latLonToMap(lat, lon) {
  return {
    x: ((lon + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100
  };
}

export function latLonToVector3(lat, lon, radius = 2.02) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
}

export function normalizeCountryName(name) {
  const normalized = String(name || "").trim().toLowerCase();
  if (["usa", "us", "america", "united states of america"].includes(normalized)) return "united states";
  if (["uk", "britain", "great britain"].includes(normalized)) return "united kingdom";
  return normalized;
}
