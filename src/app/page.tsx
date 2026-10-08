import Link from "next/link";
import { DropCard } from "@/components/DropCard";
import { Faq } from "@/components/Faq";
import { HeroMedia } from "@/components/HeroMedia";
import { faqItems } from "@/lib/faq";
import { site } from "@/lib/site";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const drops = (await getStore().listDrops()).slice(0, 6);
  const hasSample = drops.some((d) => d.sample);
  return (
    <>
      {hasSample && (
        <p className="bg-accent px-4 py-2 text-center text-sm font-bold text-accent-fg">
          Preview build with sample listings. Replace them in the admin before launch.
        </p>
      )}
      <section className="relative h-[70vh] min-h-[420px] w-full bg-fg">
        <HeroMedia />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fg via-fg/60 to-transparent" />
        <div className="container-x absolute inset-x-0 bottom-8 text-bg">
          <h1 className="font-heading text-4xl font-black uppercase leading-none sm:text-6xl">{site.tagline}</h1>
          <p className="mt-3 max-w-xl text-lg">{site.originLine}</p>
          <Link href="/drops" className="btn btn-primary mt-6 bg-bg text-fg hover:bg-accent hover:text-accent-fg">See the drops</Link>
        </div>
      </section>

      <section className="container-x py-12" aria-labelledby="current-drops">
        <div className="flex items-end justify-between">
          <h2 id="current-drops" className="font-heading text-2xl font-black uppercase sm:text-3xl">Current drops</h2>
          <Link href="/drops" className="font-semibold underline">All drops</Link>
        </div>
        {drops.length ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drops.map((d, i) => <DropCard key={d.id} drop={d} priority={i < 2} />)}
          </div>
        ) : (
          <p className="mt-6 text-muted">No drops listed yet.</p>
        )}
      </section>

      <section className="border-y-2 border-fg bg-fg py-12 text-bg" aria-labelledby="next-drop">
        <div className="container-x">
          <h2 id="next-drop" className="font-heading text-2xl font-black uppercase sm:text-3xl">Next drop</h2>
          <p className="mt-2 max-w-xl text-lg">
            {site.nextDropMonth ? `Expected ${site.nextDropMonth}. ` : ""}
            Pick a drop and tap Notify me. One email when it goes live.
          </p>
          <Link href="/drops" className="btn btn-primary mt-6 bg-bg text-fg hover:bg-accent hover:text-accent-fg">Choose a drop</Link>
        </div>
      </section>

      <section className="container-x grid gap-6 py-12 sm:grid-cols-3" aria-label="About the brand">
        <div><p className="font-heading text-lg font-bold">Heavyweight</p><p className="mt-1 text-muted">Oversized tees now. 400 GSM hoodies as the core line. Knitwear and heavy joggers planned.</p></div>
        <div><p className="font-heading text-lg font-bold">Made in Ludhiana</p><p className="mt-1 text-muted">Cut, sewn and printed in Ludhiana, India. Fabric weight and print technique listed on every drop.</p></div>
        <div><p className="font-heading text-lg font-bold">Honest stock</p><p className="mt-1 text-muted">Three states only: in stock, sold out, coming soon. No countdowns, no fake scarcity.</p></div>
      </section>

      <section className="container-x pb-4">
        <Faq items={faqItems.slice(0, 2)} />
        <p className="mt-4"><Link href="/drops" className="font-semibold underline">More answers on each drop page</Link></p>
      </section>
    </>
  );
}
