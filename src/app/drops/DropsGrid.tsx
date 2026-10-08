"use client";
import { useMemo, useState } from "react";
import { DropCard } from "@/components/DropCard";
import { usePrefs } from "@/components/Prefs";
import { priceFor } from "@/lib/format";
import { CATEGORIES, PRINT_TYPES, type Category, type Drop, type PrintType } from "@/lib/types";

type Sort = "newest" | "price_asc" | "price_desc";

export function DropsGrid({ drops }: { drops: Drop[] }) {
  const { country } = usePrefs();
  const [category, setCategory] = useState<Category | "">("");
  const [print, setPrint] = useState<PrintType | "">("");
  const [colour, setColour] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  const colours = useMemo(() => [...new Set(drops.map((d) => d.colour))].sort(), [drops]);

  const list = useMemo(() => {
    const out = drops.filter(
      (d) => (!category || d.category === category) && (!print || d.print_type === print) && (!colour || d.colour === colour),
    );
    if (sort === "newest") out.sort((a, b) => b.created_at.localeCompare(a.created_at));
    else {
      const dir = sort === "price_asc" ? 1 : -1;
      out.sort((a, b) => {
        const pa = priceFor(a, country), pb = priceFor(b, country);
        if (pa == null && pb == null) return 0;
        if (pa == null) return 1; // unpriced last
        if (pb == null) return -1;
        return (pa - pb) * dir;
      });
    }
    return out;
  }, [drops, category, print, colour, sort, country]);

  return (
    <>
      <form className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Filter drops" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="f-cat" className="label">Category</label>
          <select id="f-cat" className="input" value={category} onChange={(e) => setCategory(e.target.value as Category | "")}>
            <option value="">All</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="f-print" className="label">Print type</label>
          <select id="f-print" className="input" value={print} onChange={(e) => setPrint(e.target.value as PrintType | "")}>
            <option value="">All</option>
            {PRINT_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="f-colour" className="label">Colour</label>
          <select id="f-colour" className="input" value={colour} onChange={(e) => setColour(e.target.value)}>
            <option value="">All</option>
            {colours.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="f-sort" className="label">Sort</label>
          <select id="f-sort" className="input" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
          </select>
        </div>
      </form>
      <p className="mt-4 text-sm text-muted" aria-live="polite">{list.length} {list.length === 1 ? "drop" : "drops"}</p>
      {list.length ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d, i) => <DropCard key={d.id} drop={d} priority={i < 2} />)}
        </div>
      ) : (
        <p className="mt-6">Nothing matches those filters.</p>
      )}
    </>
  );
}
