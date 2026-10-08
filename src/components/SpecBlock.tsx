import type { Drop } from "@/lib/types";

/** Always visible. Rows with no value are hidden, never shown as TBD. */
export function SpecBlock({ drop }: { drop: Drop }) {
  const rows: [string, string | null][] = [
    ["Fabric", drop.fabric ?? (drop.gsm ? `${drop.gsm} GSM` : null)],
    ["Fit", drop.fit],
    ["Print", drop.print_type],
    ["Placement", drop.placement],
    ["Colour", drop.colour],
    ["Made in", drop.made_in],
    ["Care", drop.care],
  ];
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-2 border-fg bg-card p-4">
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-sm font-bold uppercase tracking-wide">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
    </dl>
  );
}
