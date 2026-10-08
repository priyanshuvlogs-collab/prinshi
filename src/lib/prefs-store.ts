"use client";
import type { Country } from "@/lib/site";
import type { Lang } from "@/lib/i18n";

export interface PrefState { lang: Lang; country: Country }

const listeners = new Set<() => void>();
let snapshot: PrefState | null = null;

function read(fallbackCountry: Country): PrefState {
  let lang: Lang = "en";
  let country: Country = fallbackCountry;
  try {
    const l = localStorage.getItem("prinshi_lang");
    if (l === "en" || l === "fr") lang = l;
    const c = localStorage.getItem("prinshi_country");
    if (c === "IN" || c === "CA") country = c;
  } catch {}
  return { lang, country };
}

export function getPrefs(fallbackCountry: Country): PrefState {
  if (!snapshot) snapshot = read(fallbackCountry);
  return snapshot;
}

export function setPrefs(patch: Partial<PrefState>, fallbackCountry: Country) {
  snapshot = { ...getPrefs(fallbackCountry), ...patch };
  try {
    localStorage.setItem("prinshi_lang", snapshot.lang);
    localStorage.setItem("prinshi_country", snapshot.country);
  } catch {}
  document.documentElement.lang = snapshot.lang === "fr" ? "fr-CA" : "en";
  listeners.forEach((l) => l());
}

export function subscribePrefs(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}
