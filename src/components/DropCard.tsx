import Image from "next/image";
import Link from "next/link";
import type { Drop } from "@/lib/types";
import { Price } from "./Price";
import { StockBadge } from "./StockBadge";

export function DropCard({ drop, priority = false }: { drop: Drop; priority?: boolean }) {
  const img = drop.images[0];
  return (
    <article className="group border-2 border-fg bg-card">
      <Link href={`/drops/${drop.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-line">
          {img ? (
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-[1.02]"
              priority={priority}
            />
          ) : null}
          <div className="absolute left-2 top-2 flex gap-2">
            <StockBadge state={drop.stock_state} />
            {img?.mockup && <span className="bg-card px-2 py-1 text-xs font-bold uppercase">Mockup</span>}
          </div>
        </div>
        <div className="space-y-1 p-3">
          <h3 className="font-heading text-lg font-bold leading-tight">{drop.name}</h3>
          <p className="text-sm text-muted">
            {[drop.category, drop.colour, drop.print_type ? `${drop.print_type} print` : null, drop.gsm ? `${drop.gsm} GSM` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <Price drop={drop} className="block font-semibold" />
        </div>
      </Link>
    </article>
  );
}
