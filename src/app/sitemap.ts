import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const drops = await getStore().listDrops();
  const statics = ["", "/drops", "/about", "/size-guide", "/shipping-returns", "/contact", "/privacy", "/terms", "/cookies"];
  return [
    ...statics.map((p) => ({ url: `${site.url}${p}`, lastModified: new Date() })),
    ...drops.map((d) => ({ url: `${site.url}/drops/${d.slug}`, lastModified: new Date(d.updated_at) })),
  ];
}
