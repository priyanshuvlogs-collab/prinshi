"use client";
import { useSyncExternalStore } from "react";

export type Consent = { analytics: boolean; marketing: boolean; at: string };
const KEY = "prinshi_consent_v1";
const EVENT = "prinshi:consent";

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function writeConsent(c: Omit<Consent, "at">) {
  const value: Consent = { ...c, at: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function getRaw(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

/**
 * "unknown" during SSR and hydration, then the stored consent or null when nothing was chosen.
 * Raw string snapshot keeps the reference stable between calls.
 */
export function useConsent(): Consent | null | "unknown" {
  const raw = useSyncExternalStore(subscribe, getRaw, () => "unknown");
  if (raw === "unknown") return "unknown";
  if (raw === null) return null;
  try { return JSON.parse(raw) as Consent; } catch { return null; }
}
