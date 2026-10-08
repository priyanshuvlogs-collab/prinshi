import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name}: heavyweight streetwear made in Ludhiana, India, founded in Toronto.`,
  alternates: { canonical: "/about" },
};

/**
 * ADD APPROVED TEXT: the founder and factory story goes here once the owner approves it.
 * Until then the page shows only facts already confirmed in the brand config.
 */
export default function AboutPage() {
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="font-heading text-3xl font-black uppercase sm:text-4xl">About</h1>
      <p className="mt-4 text-lg">{site.originLine}</p>
      <p className="mt-4">
        {site.name} makes premium heavyweight streetwear. Oversized tees are the current test. 400 GSM hoodies are the core line. Knitwear and heavy joggers are planned.
      </p>
      <p className="mt-4">
        Every drop lists its fabric weight, fit, print technique and placement, so you know what you are buying before you buy it.
      </p>
    </div>
  );
}
