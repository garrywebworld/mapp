import { documentaryImages, quickCountries } from "../data/country-insights.js";
import { $, formatNumber, latLonToMap } from "./utils.js";

export function setupQuickGrid(onPick) {
  const grid = $("#quickGrid");
  grid.innerHTML = "";
  quickCountries.forEach((country) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = country;
    button.addEventListener("click", () => onPick(country));
    grid.append(button);
  });
}

export function renderSuggestions(suggestions, onPick) {
  const box = $("#suggestions");
  box.innerHTML = "";
  box.classList.toggle("is-open", suggestions.length > 0);
  suggestions.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = Boolean(item.disabled);
    button.innerHTML = `<strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.region)}</span>`;
    if (!item.disabled) button.addEventListener("click", () => onPick(item.name));
    box.append(button);
  });
}

export function openCountryPanel(country) {
  const profile = country.profile;
  $("#countryFlag").src = country.flags?.svg || country.flags?.png || "";
  $("#countryFlag").alt = `${country.name.common} flag`;
  $("#countryRegion").textContent = [country.subregion, country.region].filter(Boolean).join(" / ") || "Country profile";
  $("#countryName").textContent = country.name.common;
  $("#countrySummary").textContent = `${country.name.official || country.name.common} is home to ${formatNumber(country.population)} people across ${formatNumber(country.area)} sq km.`;

  const stats = [
    ["Capital", country.capital?.join(", ") || "Not available"],
    ["Population", formatNumber(country.population)],
    ["Area", `${formatNumber(country.area)} sq km`],
    ["Currency", Object.values(country.currencies || {}).map((c) => `${c.name} ${c.symbol ? `(${c.symbol})` : ""}`).join(", ") || "Not available"],
    ["Languages", Object.values(country.languages || {}).join(", ") || "Not available"],
    ["Time zones", country.timezones?.join(", ") || "Not available"],
    ["UN member", country.unMember ? "Yes" : "No"],
    ["Climate", profile.climate]
  ];
  const statGrid = $("#statGrid");
  statGrid.innerHTML = "";
  const template = $("#statTemplate");
  stats.forEach(([label, value]) => {
    const node = template.content.cloneNode(true);
    node.querySelector("span").textContent = label;
    node.querySelector("strong").textContent = value;
    statGrid.append(node);
  });

  const details = [
    ["Government", profile.government],
    ["President / Prime Minister", profile.leader],
    ["Religion", profile.religion],
    ["GDP", profile.gdp],
    ["Major Cities", buildMajorCities(country)],
    ["Economy", `${profile.exports}. ${profile.imports}.`],
    ["Exports", profile.exports],
    ["Imports", profile.imports],
    ["Military", profile.military],
    ["Education", profile.education],
    ["Life Expectancy", profile.life],
    ["Internet Users", profile.internet],
    ["Forest Cover", profile.forest],
    ["History Summary", profile.history],
    ["Tourism", profile.tourism],
    ["Natural Resources", profile.resources],
    ["Interesting Facts", profile.facts]
  ];
  $("#detailSections").innerHTML = details
    .map(([title, text]) => `<article class="detail-section"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`)
    .join("");
  $("#infoDock").classList.add("is-open");
}

export function setupMap(countries, onPick) {
  const map = $("#worldMap");
  map.innerHTML = "";
  countries.forEach((country) => {
    if (!country.latlng?.length) return;
    const [lat, lon] = country.latlng;
    const point = latLonToMap(lat, lon);
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "map-marker";
    marker.style.left = `${point.x}%`;
    marker.style.top = `${point.y}%`;
    marker.title = country.name.common;
    marker.setAttribute("aria-label", `Focus ${country.name.common}`);
    marker.addEventListener("click", () => onPick(country.name.common));
    const label = document.createElement("span");
    label.className = "map-label";
    label.style.left = `${point.x}%`;
    label.style.top = `${point.y}%`;
    label.textContent = country.name.common;
    map.append(marker, label);
  });
}

export function setActiveMapMarker(countryName) {
  document.querySelectorAll(".map-marker").forEach((marker) => {
    marker.classList.toggle("is-active", marker.title === countryName);
  });
}

export function openDocumentary(country, onNavigate = () => {}) {
  const chapters = createChapters(country);
  let index = 0;
  const modal = $("#documentary");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  $("#docEyebrow").textContent = `Now playing / ${country.region || "Earth"}`;
  $("#docTitle").textContent = country.name.common;
  $("#docNarration").textContent = `A cinematic expedition through ${country.name.common}, from geography and history to culture, industry, natural systems, and what comes next.`;

  const render = () => {
    const chapter = chapters[index];
    $("#chapterMedia").style.backgroundImage = documentaryImages[index % documentaryImages.length];
    $("#chapterIndex").textContent = String(index + 1).padStart(2, "0");
    $("#chapterTitle").textContent = chapter.title;
    $("#chapterText").textContent = chapter.text;
    $("#timeline").innerHTML = chapters
      .map(
        (item, itemIndex) =>
          `<button type="button" data-index="${itemIndex}" class="${itemIndex === index ? "is-active" : ""}"><strong>${String(itemIndex + 1).padStart(2, "0")}</strong><br>${escapeHtml(item.title)}</button>`
      )
      .join("");
    document.querySelectorAll("#timeline button").forEach((button) => {
      button.addEventListener("click", () => {
        index = Number(button.dataset.index);
        onNavigate();
        animateChapter(render);
      });
    });
  };

  $("#prevChapter").onclick = () => {
    index = (index - 1 + chapters.length) % chapters.length;
    onNavigate();
    animateChapter(render);
  };
  $("#nextChapter").onclick = () => {
    index = (index + 1) % chapters.length;
    onNavigate();
    animateChapter(render);
  };
  render();
  animateChapter();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}

function animateChapter(callback) {
  if (callback) callback();
  if (window.gsap) {
    window.gsap.fromTo(".chapter-frame", { opacity: 0, y: 26, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out" });
  }
}

function createChapters(country) {
  const p = country.profile;
  return [
    { title: "Introduction", text: `${country.name.common} enters the frame as a living system of people, terrain, climate, cities, and memory.` },
    { title: "History", text: p.history },
    { title: "Geography", text: `${p.climate} Its land area spans ${formatNumber(country.area)} square kilometers, with coordinates near ${country.latlng?.join(", ") || "the region center"}.` },
    { title: "Economy", text: `${p.gdp}. Exports include ${p.exports.toLowerCase()}. Imports include ${p.imports.toLowerCase()}.` },
    { title: "Culture", text: `Languages include ${Object.values(country.languages || {}).join(", ") || "many local languages"}. Religious and cultural life: ${p.religion}.` },
    { title: "Tourism", text: p.tourism },
    { title: "Future", text: `${country.name.common}'s next chapter will be shaped by education, climate resilience, infrastructure, technology, and how its people steward natural resources.` }
  ];
}

function buildMajorCities(country) {
  const capital = country.capital?.[0];
  const known = {
    India: "Mumbai, Delhi, Bengaluru, Kolkata, Chennai, Hyderabad",
    Brazil: "Sao Paulo, Rio de Janeiro, Brasilia, Salvador, Fortaleza",
    Japan: "Tokyo, Osaka, Yokohama, Nagoya, Sapporo, Kyoto",
    Germany: "Berlin, Hamburg, Munich, Cologne, Frankfurt",
    "United States": "New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia",
    France: "Paris, Marseille, Lyon, Toulouse, Nice, Nantes"
  };
  return known[country.name.common] || [capital, "regional capitals", "major ports", "historic cities"].filter(Boolean).join(", ");
}
