import type { Metadata } from "next";
import { getStore } from "@/lib/store";
import { DropsGrid } from "./DropsGrid";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Drops",
  description: "Every Prinshi Trades drop: oversized tees and heavyweight hoodies with fabric weight, print technique and real stock state.",
  alternates: { canonical: "/drops" },
};

export default async function DropsPage() {
  const drops = await getStore().listDrops();
  return (
    <div className="container-x py-8">
      <h1 className="font-heading text-3xl font-black uppercase sm:text-4xl">Drops</h1>
      <DropsGrid drops={drops} />
    </div>
  );
}
