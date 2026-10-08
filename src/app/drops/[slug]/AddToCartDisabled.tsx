"use client";
import { useState } from "react";
import { usePrefs } from "@/components/Prefs";
import { site } from "@/lib/site";
import type { Size } from "@/lib/types";

/** Phase 1: sizes are shown, Add to cart stays disabled. */
export function AddToCartDisabled({ sizes }: { sizes: Size[] }) {
  const { label } = usePrefs();
  const [size, setSize] = useState<Size | "">("");
  return (
    <div className="space-y-3 border-2 border-fg bg-card p-5">
      <fieldset>
        <legend className="label">Size</legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <label key={s} className={`cursor-pointer border-2 px-4 py-2 font-bold ${size === s ? "border-fg bg-fg text-bg" : "border-line"}`}>
              <input type="radio" name="size" value={s} className="sr-only" checked={size === s} onChange={() => setSize(s)} />
              {s}
            </label>
          ))}
        </div>
      </fieldset>
      <button type="button" className="btn btn-primary w-full" disabled aria-describedby="cart-note">{label("add_to_cart")}</button>
      <p id="cart-note" className="text-sm font-semibold">{site.checkoutClosedLabel}</p>
    </div>
  );
}
