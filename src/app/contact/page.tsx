import type { Metadata } from "next";
import { OutboundLink, WhatsAppLink } from "@/components/Tracked";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Prinshi Trades by email, WhatsApp or Instagram.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const c = site.contact;
  const none = !c.email && !c.whatsapp && !c.instagram;
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="font-heading text-3xl font-black uppercase sm:text-4xl">Contact</h1>
      <ul className="mt-6 space-y-4 text-lg">
        {c.email && <li>Email: <a className="underline" href={`mailto:${c.email}`}>{c.email}</a></li>}
        {c.whatsapp && <li>WhatsApp: <WhatsAppLink number={c.whatsapp} className="underline">{c.whatsapp}</WhatsAppLink></li>}
        {c.instagram && <li>Instagram: <OutboundLink href={`https://instagram.com/${c.instagram}`} className="underline">@{c.instagram}</OutboundLink></li>}
      </ul>
      {none && <p className="mt-6 text-muted">Contact details are being set up. Join a Notify me list on any drop and we will reach you by email.</p>}
    </div>
  );
}
