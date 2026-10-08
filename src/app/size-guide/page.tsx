import type { Metadata } from "next";
import { SizeChart } from "@/components/SizeChart";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Size guide",
  description: "Chest, length and shoulder in cm and inches for every Prinshi Trades drop, with unisex fit notes.",
  alternates: { canonical: "/size-guide" },
};

export default async function SizeGuidePage() {
  const drops = (await getStore().listDrops()).filter((d) => d.size_chart.length);
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="font-heading text-3xl font-black uppercase sm:text-4xl">Size guide</h1>
      <section className="mt-4 space-y-3">
        <h2 className="font-heading text-xl font-bold">Unisex fit notes</h2>
        <p>All sizes are unisex. The cut is oversized with a drop shoulder, so the shoulder seam sits below the shoulder bone.</p>
        <p>Measure a tee or hoodie you like the fit of, laid flat. Chest is armpit to armpit. Length is from the highest point of the shoulder to the hem. Compare those numbers with the chart.</p>
        <p>If you are between sizes: size down for a closer fit, size up for a boxier fit.</p>
      </section>
      <div className="mt-8 space-y-6">
        {drops.length ? (
          drops.map((d) => (
            <div key={d.id}>
              <h2 className="mb-2 font-heading text-xl font-bold">{d.name}</h2>
              <SizeChart drop={d} />
            </div>
          ))
        ) : (
          <p className="text-muted">Size charts are published with each drop.</p>
        )}
      </div>
    </div>
  );
}
