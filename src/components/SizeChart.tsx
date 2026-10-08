"use client";
import { useState } from "react";
import { cmToIn } from "@/lib/format";
import type { Drop } from "@/lib/types";

export function SizeChart({ drop }: { drop: Pick<Drop, "size_chart" | "model_height_cm" | "model_size"> }) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  if (!drop.size_chart.length) return null;
  const f = (cm: number) => (unit === "cm" ? String(cm) : cmToIn(cm));
  return (
    <section aria-labelledby="size-chart-title" className="border-2 border-fg bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 id="size-chart-title" className="font-heading text-lg font-bold">Size chart</h3>
        <div role="group" aria-label="Units" className="flex border-2 border-fg text-sm font-bold">
          {(["cm", "in"] as const).map((u) => (
            <button key={u} type="button" aria-pressed={unit === u} onClick={() => setUnit(u)} className={`px-3 py-1 ${unit === u ? "bg-fg text-bg" : ""}`}>
              {u}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-fg">
              <th scope="col" className="py-2 pr-3">Size</th>
              <th scope="col" className="py-2 pr-3">Chest ({unit})</th>
              <th scope="col" className="py-2 pr-3">Length ({unit})</th>
              <th scope="col" className="py-2">Shoulder ({unit})</th>
            </tr>
          </thead>
          <tbody>
            {drop.size_chart.map((r) => (
              <tr key={r.size} className="border-b border-line">
                <th scope="row" className="py-2 pr-3 font-bold">{r.size}</th>
                <td className="py-2 pr-3">{f(r.chest_cm)}</td>
                <td className="py-2 pr-3">{f(r.length_cm)}</td>
                <td className="py-2">{f(r.shoulder_cm)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {drop.model_height_cm && drop.model_size && (
        <p className="mt-3 text-sm text-muted">
          Model is {drop.model_height_cm} cm ({cmToIn(drop.model_height_cm)} in) and wears size {drop.model_size}.
        </p>
      )}
    </section>
  );
}
