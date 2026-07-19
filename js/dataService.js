import { insightProfiles } from "../data/country-insights.js";
import { normalizeCountryName } from "./utils.js";

const fallbackCountries = [
  {
    name: { common: "India", official: "Republic of India" },
    capital: ["New Delhi"],
    population: 1428627663,
    area: 3287590,
    region: "Asia",
    subregion: "Southern Asia",
    latlng: [20.5937, 78.9629],
    flags: { svg: "https://flagcdn.com/in.svg" },
    currencies: { INR: { name: "Indian rupee", symbol: "Rs" } },
    languages: { hin: "Hindi", eng: "English" },
    timezones: ["UTC+05:30"],
    unMember: true
  },
  {
    name: { common: "Brazil", official: "Federative Republic of Brazil" },
    capital: ["Brasilia"],
    population: 203062512,
    area: 8515767,
    region: "Americas",
    subregion: "South America",
    latlng: [-10, -55],
    flags: { svg: "https://flagcdn.com/br.svg" },
    currencies: { BRL: { name: "Brazilian real", symbol: "R$" } },
    languages: { por: "Portuguese" },
    timezones: ["UTC-05:00", "UTC-04:00", "UTC-03:00", "UTC-02:00"],
    unMember: true
  },
  {
    name: { common: "Japan", official: "Japan" },
    capital: ["Tokyo"],
    population: 124516650,
    area: 377930,
    region: "Asia",
    subregion: "Eastern Asia",
    latlng: [36, 138],
    flags: { svg: "https://flagcdn.com/jp.svg" },
    currencies: { JPY: { name: "Japanese yen", symbol: "¥" } },
    languages: { jpn: "Japanese" },
    timezones: ["UTC+09:00"],
    unMember: true
  },
  {
    name: { common: "Germany", official: "Federal Republic of Germany" },
    capital: ["Berlin"],
    population: 83294633,
    area: 357114,
    region: "Europe",
    subregion: "Western Europe",
    latlng: [51, 9],
    flags: { svg: "https://flagcdn.com/de.svg" },
    currencies: { EUR: { name: "Euro", symbol: "€" } },
    languages: { deu: "German" },
    timezones: ["UTC+01:00"],
    unMember: true
  },
  {
    name: { common: "United States", official: "United States of America" },
    capital: ["Washington, D.C."],
    population: 334914895,
    area: 9372610,
    region: "Americas",
    subregion: "North America",
    latlng: [38, -97],
    flags: { svg: "https://flagcdn.com/us.svg" },
    currencies: { USD: { name: "United States dollar", symbol: "$" } },
    languages: { eng: "English" },
    timezones: ["UTC-12:00 to UTC+12:00"],
    unMember: true
  },
  {
    name: { common: "France", official: "French Republic" },
    capital: ["Paris"],
    population: 68170228,
    area: 551695,
    region: "Europe",
    subregion: "Western Europe",
    latlng: [46, 2],
    flags: { svg: "https://flagcdn.com/fr.svg" },
    currencies: { EUR: { name: "Euro", symbol: "€" } },
    languages: { fra: "French" },
    timezones: ["UTC-10:00 to UTC+12:00"],
    unMember: true
  }
];

let countryCache = null;

async function requestJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export async function getAllCountries() {
  if (countryCache) return countryCache;
  try {
    const countries = await requestJson(
      "https://restcountries.com/v3.1/all?fields=name,capital,population,area,region,subregion,latlng,flags,currencies,languages,timezones,unMember"
    );
    countryCache = countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
  } catch {
    countryCache = fallbackCountries;
  }
  return countryCache;
}

export async function searchCountry(query) {
  const normalized = normalizeCountryName(query);
  const countries = await getAllCountries();
  const exact = countries.find((country) => {
    const common = normalizeCountryName(country.name.common);
    const official = normalizeCountryName(country.name.official);
    return common === normalized || official === normalized;
  });
  if (exact) return enrichCountry(exact);

  try {
    const result = await requestJson(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=false`);
    return enrichCountry(result[0]);
  } catch {
    const fuzzy = countries.find((country) => normalizeCountryName(country.name.common).includes(normalized));
    if (!fuzzy) throw new Error("Country not found");
    return enrichCountry(fuzzy);
  }
}

export async function suggestCountries(query) {
  const normalized = normalizeCountryName(query);
  if (!normalized) return [];
  const countries = await getAllCountries();
  return countries
    .filter((country) => normalizeCountryName(country.name.common).includes(normalized))
    .slice(0, 8)
    .map((country) => ({
      name: country.name.common,
      region: country.region || "Earth",
      latlng: country.latlng || [0, 0]
    }));
}

export function enrichCountry(country) {
  const key = normalizeCountryName(country.name.common);
  const profile = insightProfiles[key] || createGenericProfile(country);
  return { ...country, profile };
}

function createGenericProfile(country) {
  const name = country.name.common;
  const region = [country.subregion, country.region].filter(Boolean).join(", ") || "its region";
  return {
    government: "Government details vary by constitutional structure and current leadership.",
    leader: "Current head-of-state and head-of-government data should be verified from official national sources.",
    religion: "Religious life is shaped by the country's communities, history, migration, and legal traditions.",
    gdp: "GDP varies by source and year; use World Bank or IMF releases for the latest figure.",
    exports: "Major exports reflect local resources, manufacturing capacity, and service industries.",
    imports: "Major imports usually include energy, machinery, food, medicines, or specialized industrial inputs.",
    military: "Defense organization reflects geography, alliances, security risks, and national policy.",
    education: "Education systems typically combine primary, secondary, vocational, and higher education pathways.",
    life: "Life expectancy varies by year and source; official health agencies provide the most current figures.",
    internet: "Internet adoption changes quickly as mobile networks and broadband expand.",
    forest: "Forest cover depends on land management, climate, protected areas, and economic pressures.",
    climate: `${name} sits in ${region}, giving it climate patterns shaped by latitude, elevation, oceans, and seasonal winds.`,
    history: `${name} has a layered national story shaped by geography, peoples, trade, conflict, migration, and political change.`,
    tourism: `Visitors explore ${name} for cities, landscapes, food, heritage, festivals, and natural landmarks.`,
    resources: "Natural resources include land, water, biodiversity, minerals, energy potential, and human skill.",
    facts: `${name} rewards closer study because every country carries local histories and ecological detail beyond a single statistic.`
  };
}
