"use client";
import type { StockState } from "@/lib/types";
import { usePrefs } from "./Prefs";

const styles: Record<StockState, string> = {
  in_stock: "bg-fg text-bg",
  sold_out: "bg-muted text-bg",
  coming_soon: "bg-accent text-accent-fg",
};

export function StockBadge({ state }: { state: StockState }) {
  const { label } = usePrefs();
  return (
    <span className={`inline-block px-2 py-1 text-xs font-bold uppercase tracking-wide ${styles[state]}`}>
      {label(state)}
    </span>
  );
}
