import type { Metadata } from "next";
import { LegalNotice } from "@/components/LegalNotice";
import { ConsentReset } from "./ConsentReset";

export const metadata: Metadata = { title: "Cookie notice", description: "Which cookies the Prinshi Trades site uses and how to change your choice.", alternates: { canonical: "/cookies" } };

export default function CookiesPage() {
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="font-heading text-3xl font-black uppercase sm:text-4xl">Cookie notice</h1>
      <LegalNotice />
      <div className="mt-6 space-y-4">
        <p>This is a template. A lawyer reviews it before launch.</p>
        <h2 className="font-heading text-xl font-bold">Strictly necessary</h2>
        <p>Your language, country and cookie choice are saved in your browser so the site remembers them. No tracking.</p>
        <h2 className="font-heading text-xl font-bold">Analytics (optional)</h2>
        <p>Google Analytics 4 counts page views and which drops get looked at. It loads only after you choose Accept all. Reject all keeps it off.</p>
        <h2 className="font-heading text-xl font-bold">Advertising (optional)</h2>
        <p>If we run paid ads, a Meta Pixel may load, again only after Accept all. It is not loaded today.</p>
        <h2 className="font-heading text-xl font-bold">Change your choice</h2>
        <ConsentReset />
      </div>
    </div>
  );
}
