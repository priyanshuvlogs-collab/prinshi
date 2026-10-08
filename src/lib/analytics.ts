"use client";
import { readConsent } from "@/lib/consent";

type EventName =
  | "drop_view"
  | "notify_submit"
  | "whatsapp_click"
  | "size_guide_open"
  | "outbound_click";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends a GA4 event only when analytics consent was given and gtag is loaded. */
export function track(name: EventName, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined") return;
  if (!readConsent()?.analytics) return;
  window.gtag?.("event", name, params);
}
