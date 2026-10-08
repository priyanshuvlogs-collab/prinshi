import type { Country } from "@/lib/site";
import type { Drop, StockState } from "@/lib/types";

export function formatPrice(drop: Pick<Drop, "price_inr" | "price_cad">, country: Country): string | null {
  if (country === "CA" && drop.price_cad != null) {
    return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(drop.price_cad);
  }
  if (country === "IN" && drop.price_inr != null) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(drop.price_inr);
  }
  return null;
}

export function priceFor(drop: Pick<Drop, "price_inr" | "price_cad">, country: Country): number | null {
  return country === "CA" ? drop.price_cad : drop.price_inr;
}

export const stockLabelKey: Record<StockState, "in_stock" | "sold_out" | "coming_soon"> = {
  in_stock: "in_stock",
  sold_out: "sold_out",
  coming_soon: "coming_soon",
};

export function cmToIn(cm: number): string {
  return (cm / 2.54).toFixed(1);
}

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
