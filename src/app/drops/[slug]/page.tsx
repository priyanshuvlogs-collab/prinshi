import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { Gallery } from "@/components/Gallery";
import { NotifyForm } from "@/components/NotifyForm";
import { Price } from "@/components/Price";
import { SizeChart } from "@/components/SizeChart";
import { SpecBlock } from "@/components/SpecBlock";
import { StockBadge } from "@/components/StockBadge";
import { DropViewTracker, SizeGuideLink, WhatsAppLink } from "@/components/Tracked";
import { faqItems } from "@/lib/faq";
import { site } from "@/lib/site";
import { getStore } from "@/lib/store";
import { AddToCartDisabled } from "./AddToCartDisabled";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/drops/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const drop = await getStore().getDrop(slug);
  if (!drop) return { title: "Not found" };
  const bits = [drop.category, drop.colour, drop.print_type ? `${drop.print_type} print` : null, drop.gsm ? `${drop.gsm} GSM` : null].filter(Boolean);
  return {
    title: drop.name,
    description: `${drop.name}: ${bits.join(", ")}. ${site.originLine}`,
    alternates: { canonical: `/drops/${drop.slug}` },
    openGraph: { images: drop.images[0] ? [{ url: drop.images[0].src, alt: drop.images[0].alt }] : [] },
  };
}

const availability: Record<string, string> = {
  in_stock: "https://schema.org/InStock",
  sold_out: "https://schema.org/SoldOut",
  coming_soon: "https://schema.org/PreOrder",
};

export default async function DropPage({ params }: PageProps<"/drops/[slug]">) {
  const { slug } = await params;
  const drop = await getStore().getDrop(slug);
  if (!drop) notFound();

  const offers = [
    drop.price_inr != null && { "@type": "Offer", priceCurrency: "INR", price: drop.price_inr, availability: availability[drop.stock_state], url: `${site.url}/drops/${drop.slug}` },
    drop.price_cad != null && { "@type": "Offer", priceCurrency: "CAD", price: drop.price_cad, availability: availability[drop.stock_state], url: `${site.url}/drops/${drop.slug}` },
  ].filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: drop.name,
    description: drop.design,
    image: drop.images.map((i) => `${site.url}${i.src}`),
    brand: { "@type": "Brand", name: site.name },
    color: drop.colour,
    material: drop.fabric ?? undefined,
    ...(offers.length ? { offers } : {}),
  };

  return (
    <div className="container-x py-8">
      <DropViewTracker productId={drop.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {drop.sample && (
        <p className="mb-4 bg-accent px-4 py-2 text-sm font-bold text-accent-fg">Sample listing. Not a real product yet.</p>
      )}
      <div className="grid gap-8 md:grid-cols-2">
        <Gallery images={drop.images} name={drop.name} />
        <div className="space-y-5">
          <div>
            <StockBadge state={drop.stock_state} />
            <h1 className="mt-2 font-heading text-3xl font-black uppercase leading-none sm:text-4xl">{drop.name}</h1>
            <p className="mt-2 text-muted">{drop.design}</p>
            <Price drop={drop} className="mt-3 block text-2xl font-bold" />
            {drop.stock_state === "coming_soon" && drop.expected_month && (
              <p className="mt-1 font-semibold">Expected {drop.expected_month}</p>
            )}
          </div>

          <SpecBlock drop={drop} />

          {drop.stock_state === "in_stock" ? (
            <AddToCartDisabled sizes={drop.sizes} />
          ) : (
            <NotifyForm drop={drop} />
          )}

          <p className="text-sm">
            <SizeGuideLink className="underline">Size guide</SizeGuideLink>
            {site.contact.whatsapp && (
              <>
                {" · "}
                <WhatsAppLink number={site.contact.whatsapp} className="underline">Ask on WhatsApp</WhatsAppLink>
              </>
            )}
          </p>

          <SizeChart drop={drop} />
        </div>
      </div>
      <div className="mt-12 max-w-3xl">
        <Faq items={faqItems} />
      </div>
    </div>
  );
}
