import { site } from "@/lib/site";

export function LegalNotice() {
  return (
    <p className="mt-4 inline-block border-2 border-accent px-3 py-1 text-sm font-bold uppercase text-accent">{site.legalReviewNotice}</p>
  );
}
