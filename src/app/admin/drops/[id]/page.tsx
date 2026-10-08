import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { newId, slugify } from "@/lib/format";
import { getStore } from "@/lib/store";
import { CATEGORIES, PLACEMENTS, PRINT_TYPES, SIZES, STOCK_STATES, type Drop, type Size, type SizeRow } from "@/lib/types";

export default async function EditDrop({ params }: PageProps<"/admin/drops/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const isNew = id === "new";
  const store = getStore();
  const drop = isNew ? null : await store.getDrop(id);
  if (!isNew && !drop) notFound();

  async function save(formData: FormData) {
    "use server";
    await requireAdmin();
    const g = (k: string) => String(formData.get(k) ?? "").trim();
    const num = (k: string) => (g(k) ? Number(g(k)) : null);
    const now = new Date().toISOString();
    const existing = isNew ? null : await getStore().getDrop(id);
    const name = g("name");
    const sizes = SIZES.filter((s) => formData.get(`size_${s}`) === "on");
    const size_chart: SizeRow[] = sizes
      .map((s) => ({ size: s, chest_cm: Number(g(`chest_${s}`)), length_cm: Number(g(`length_${s}`)), shoulder_cm: Number(g(`shoulder_${s}`)) }))
      .filter((r) => r.chest_cm > 0 && r.length_cm > 0 && r.shoulder_cm > 0);
    const images = g("images")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [src, alt, flag] = l.split("|").map((x) => x.trim());
        return { src, alt: alt || name, mockup: flag === "mockup" };
      });
    const next: Drop = {
      id: existing?.id ?? newId("drop"),
      slug: g("slug") ? slugify(g("slug")) : slugify(name),
      name,
      category: g("category") as Drop["category"],
      colour: g("colour"),
      design: g("design"),
      print_type: (g("print_type") || null) as Drop["print_type"],
      placement: (g("placement") || null) as Drop["placement"],
      fabric: g("fabric") || null,
      gsm: num("gsm"),
      fit: g("fit") || null,
      care: g("care") || null,
      made_in: g("made_in") || "Ludhiana, India",
      price_inr: num("price_inr"),
      price_cad: num("price_cad"),
      stock_state: g("stock_state") as Drop["stock_state"],
      sizes,
      size_chart,
      model_height_cm: num("model_height_cm"),
      model_size: (g("model_size") || null) as Size | null,
      expected_month: g("expected_month") || null,
      images,
      sample: formData.get("sample") === "on",
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };
    await getStore().upsertDrop(next);
    redirect("/admin");
  }

  async function remove() {
    "use server";
    await requireAdmin();
    await getStore().deleteDrop(id);
    redirect("/admin");
  }

  const d = drop;
  const chart = new Map(d?.size_chart.map((r) => [r.size, r]));
  return (
    <div>
      <h1 className="font-heading text-2xl font-black uppercase">{isNew ? "New drop" : `Edit: ${d!.name}`}</h1>
      <form action={save} className="mt-6 grid gap-4 md:grid-cols-2">
        <F label="Name" name="name" value={d?.name} required />
        <F label="Slug (auto from name if blank)" name="slug" value={d?.slug} />
        <Sel label="Category" name="category" value={d?.category ?? "Tee"} options={CATEGORIES} />
        <F label="Colour" name="colour" value={d?.colour} required />
        <div className="md:col-span-2">
          <label className="label" htmlFor="design">Design (short description)</label>
          <textarea id="design" name="design" className="input" rows={3} defaultValue={d?.design} />
        </div>
        <Sel label="Print type" name="print_type" value={d?.print_type ?? ""} options={["", ...PRINT_TYPES]} />
        <Sel label="Placement" name="placement" value={d?.placement ?? ""} options={["", ...PLACEMENTS]} />
        <F label="Fabric (e.g. 100% cotton, 400 GSM)" name="fabric" value={d?.fabric ?? ""} />
        <F label="GSM" name="gsm" type="number" value={d?.gsm ?? ""} />
        <F label="Fit" name="fit" value={d?.fit ?? ""} />
        <F label="Care" name="care" value={d?.care ?? ""} />
        <F label="Made in" name="made_in" value={d?.made_in ?? "Ludhiana, India"} />
        <Sel label="Stock state" name="stock_state" value={d?.stock_state ?? "coming_soon"} options={STOCK_STATES} />
        <F label="Price INR (blank = not shown)" name="price_inr" type="number" value={d?.price_inr ?? ""} />
        <F label="Price CAD (blank = not shown)" name="price_cad" type="number" value={d?.price_cad ?? ""} />
        <F label="Expected month (coming soon only)" name="expected_month" value={d?.expected_month ?? ""} />
        <F label="Model height cm" name="model_height_cm" type="number" value={d?.model_height_cm ?? ""} />
        <Sel label="Model wears size" name="model_size" value={d?.model_size ?? ""} options={["", ...SIZES]} />
        <div className="md:col-span-2">
          <p className="label">Sizes offered and size chart (cm). Leave a row blank to hide it from the chart.</p>
          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead><tr><th className="pr-3 text-left">Offer</th><th className="pr-3">Size</th><th className="pr-3">Chest</th><th className="pr-3">Length</th><th>Shoulder</th></tr></thead>
              <tbody>
                {SIZES.map((s) => (
                  <tr key={s}>
                    <td className="pr-3"><input type="checkbox" name={`size_${s}`} defaultChecked={d?.sizes.includes(s) ?? ["S", "M", "L", "XL"].includes(s)} aria-label={`Offer size ${s}`} /></td>
                    <td className="pr-3 font-bold">{s}</td>
                    <td className="pr-3"><input name={`chest_${s}`} type="number" step="0.5" className="input w-24" defaultValue={chart.get(s)?.chest_cm ?? ""} aria-label={`Chest ${s}`} /></td>
                    <td className="pr-3"><input name={`length_${s}`} type="number" step="0.5" className="input w-24" defaultValue={chart.get(s)?.length_cm ?? ""} aria-label={`Length ${s}`} /></td>
                    <td><input name={`shoulder_${s}`} type="number" step="0.5" className="input w-24" defaultValue={chart.get(s)?.shoulder_cm ?? ""} aria-label={`Shoulder ${s}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="images">Images, one per line: path | alt text | mockup</label>
          <textarea id="images" name="images" className="input font-mono text-sm" rows={5} defaultValue={d?.images.map((i) => `${i.src} | ${i.alt}${i.mockup ? " | mockup" : ""}`).join("\n")} />
          <p className="mt-1 text-xs text-muted">Put files in /public/images. Order: front, back, print close-up, on-model.</p>
        </div>
        <label className="flex items-center gap-2 md:col-span-2"><input type="checkbox" name="sample" defaultChecked={d?.sample ?? false} /> Sample listing (shows a visible banner)</label>
        <div className="flex gap-3 md:col-span-2">
          <button className="btn btn-primary" type="submit">Save</button>
        </div>
      </form>
      {!isNew && (
        <form action={remove} className="mt-6">
          <button className="btn btn-secondary" type="submit">Delete this drop</button>
        </form>
      )}
    </div>
  );
}

function F({ label, name, value, type = "text", required }: { label: string; name: string; value?: string | number | null; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="input" defaultValue={value ?? ""} required={required} />
    </div>
  );
}
function Sel({ label, name, value, options }: { label: string; name: string; value: string; options: readonly string[] }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <select id={name} name={name} className="input" defaultValue={value}>
        {options.map((o) => <option key={o} value={o}>{o || "—"}</option>)}
      </select>
    </div>
  );
}
