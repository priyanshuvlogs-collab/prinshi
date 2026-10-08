import type { Metadata } from "next";
import { LegalNotice } from "@/components/LegalNotice";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy", description: `How ${site.name} collects and uses personal data.`, alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <div className="container-x prose max-w-3xl py-10">
      <h1 className="font-heading text-3xl font-black uppercase sm:text-4xl">Privacy policy</h1>
      <LegalNotice />
      <div className="mt-6 space-y-4">
        <p>This is a template. A lawyer reviews it before launch. It describes what the site does today.</p>
        <h2 className="font-heading text-xl font-bold">What we collect</h2>
        <p>When you join a Notify me list we store your email address, your size preference, your country (India or Canada), your WhatsApp number if you give one, the campaign link you arrived from (UTM parameters), the time of sign-up, and which updates you consented to, with the time of consent.</p>
        <h2 className="font-heading text-xl font-bold">Why</h2>
        <p>To tell you when the drop you chose goes live, and, only if you ticked the box, to send you drop updates by email or WhatsApp. Email updates start only after you confirm your address through the link we send (double opt-in).</p>
        <h2 className="font-heading text-xl font-bold">Legal basis</h2>
        <p>Consent. India&apos;s Digital Personal Data Protection Act 2023 and Canada&apos;s anti-spam law (CASL) both apply. We keep a record of your consent.</p>
        <h2 className="font-heading text-xl font-bold">Withdrawing consent</h2>
        <p>Every marketing email has an unsubscribe link. You can also write to us using the details on the Contact page to have your record deleted.</p>
        <h2 className="font-heading text-xl font-bold">Analytics</h2>
        <p>Analytics cookies load only after you choose Accept all in the cookie banner. See the Cookie notice.</p>
        <h2 className="font-heading text-xl font-bold">Where data is stored</h2>
        <p>Waitlist records are stored with our hosting and database providers. Sign-ups may also be sent to our email service provider so we can send the confirmation email.</p>
      </div>
    </div>
  );
}
