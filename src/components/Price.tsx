"use client";
import { formatPrice } from "@/lib/format";
import type { Drop } from "@/lib/types";
import { usePrefs } from "./Prefs";

/** Shows the price for the visitor's country. Renders nothing when no price is set. */
export function Price({ drop, className = "" }: { drop: Pick<Drop, "price_inr" | "price_cad">; className?: string }) {
  const { country } = usePrefs();
  const p = formatPrice(drop, country);
  if (!p) return null;
  return <span className={className}>{p}</span>;
}
