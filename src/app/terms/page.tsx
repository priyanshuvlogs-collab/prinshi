import type { Metadata } from "next";
import { LegalNotice } from "@/components/LegalNotice";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms", description: `Terms of use for the ${site.name} website.`, alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="font-heading text-3xl font-black uppercase sm:text-4xl">Terms</h1>
      <LegalNotice />
      <div className="mt-6 space-y-4">
        <p>This is a template. A lawyer reviews it before launch.</p>
        <h2 className="font-heading text-xl font-bold">The site</h2>
        <p>{site.name} shows upcoming and current drops and lets you join a waitlist. No purchases can be made on the site yet. Prices shown, where shown, are indicative until checkout opens.</p>
        <h2 className="font-heading text-xl font-bold">Content</h2>
        <p>All designs and artwork are original and belong to {site.name}. Mockups are labelled as mockups.</p>
        <h2 className="font-heading text-xl font-bold">Sales terms</h2>
        <p>Terms of sale for India and Canada, including delivery windows, fees, duties, returns and exchanges, will be published before checkout opens.</p>
      </div>
    </div>
  );
}
