/**
 * Brand and site configuration.
 *
 * Anything that is `null` is not yet confirmed by the owner and is hidden
 * from visitors. Fill it in here (or via env) and the UI shows it.
 * Never put placeholder text like "TBD" in a visitor-facing field.
 */
export const site = {
  name: "Prinshi Trades",
  tagline: "Premium heavyweight streetwear.",
  /** CONFIRM WORDING with the owner before launch. */
  originLine: "Made in Ludhiana, India. Founded in Toronto.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Default locale for prices and copy. */
  defaultCountry: "IN" as const,
  contact: {
    email: null as string | null,
    whatsapp: null as string | null, // E.164, e.g. "+919876543210"
    instagram: null as string | null, // handle without @
  },
  /** Expected month for the next drop, e.g. "November 2026". null hides it. */
  nextDropMonth: null as string | null,
  /** Hero media. Until the clip exists, only the poster is used. */
  hero: {
    poster: "/images/hero-poster.svg",
    video: null as string | null, // e.g. "/media/hero.mp4"
    posterAlt: "Prinshi Trades heavyweight oversized tee, flat lay on a concrete floor",
  },
  /** Copy for the disabled Add to cart button in Phase 1. ADD COPY if the owner wants different wording. */
  checkoutClosedLabel: "Checkout opens with the drop",
  legalReviewNotice: "Pending legal review",
};

export type Country = "IN" | "CA";

export const countries: Record<Country, { label: string; currency: "INR" | "CAD" }> = {
  IN: { label: "India", currency: "INR" },
  CA: { label: "Canada", currency: "CAD" },
};
