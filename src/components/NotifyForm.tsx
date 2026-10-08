"use client";
import Link from "next/link";
import { useState } from "react";
import { track } from "@/lib/analytics";
import type { Drop, Size } from "@/lib/types";
import { usePrefs } from "./Prefs";

type Status = "idle" | "submitting" | "done";

export function NotifyForm({ drop }: { drop: Drop }) {
  const { label, country, setCountry } = usePrefs();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [size, setSize] = useState<Size | "">("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consentEmail, setConsentEmail] = useState(false);
  const [consentWa, setConsentWa] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!size) errs.size = "Choose a size.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
    if (whatsapp && !/^\+[1-9]\d{6,14}$/.test(whatsapp.replace(/[\s-]/g, "")))
      errs.whatsapp = "Use the international format, starting with + and the country code.";
    if (consentWa && !whatsapp) errs.whatsapp = "Add a WhatsApp number to get updates on WhatsApp.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("submitting");
    const utm = new URLSearchParams(window.location.search);
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: drop.id,
        size,
        email,
        whatsapp: whatsapp ? whatsapp.replace(/[\s-]/g, "") : null,
        country,
        consent_email: consentEmail,
        consent_whatsapp: consentWa,
        utm_source: utm.get("utm_source"),
        utm_medium: utm.get("utm_medium"),
        utm_campaign: utm.get("utm_campaign"),
      }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setErrors({ form: data.error ?? "Something went wrong. Try again." });
      setStatus("idle");
      return;
    }
    track("notify_submit", { product_id: drop.id, size });
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div role="status" className="border-2 border-fg bg-card p-5">
        <h3 className="font-heading text-xl font-bold">You&apos;re on the list.</h3>
        <p className="mt-2">
          We sent a confirmation email to <strong>{email}</strong>. Open the link in it to confirm. Until then, nothing else is sent.
        </p>
        {consentWa && whatsapp && (
          <p className="mt-2 text-sm text-muted">WhatsApp updates will go to {whatsapp} once we announce this drop.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 border-2 border-fg bg-card p-5" aria-labelledby="notify-title">
      <h3 id="notify-title" className="font-heading text-xl font-bold">{label("notify_me")}</h3>
      <p className="text-sm text-muted">One email when this drop goes live. No spam.</p>

      <fieldset>
        <legend className="label">Size preference <span aria-hidden="true">*</span></legend>
        <div className="flex flex-wrap gap-2">
          {drop.sizes.map((s) => (
            <label key={s} className={`cursor-pointer border-2 px-4 py-2 font-bold ${size === s ? "border-fg bg-fg text-bg" : "border-line"}`}>
              <input type="radio" name="size" value={s} className="sr-only" checked={size === s} onChange={() => setSize(s)} required />
              {s}
            </label>
          ))}
        </div>
        {errors.size && <p className="error" role="alert">{errors.size}</p>}
      </fieldset>

      <div>
        <label htmlFor="email" className="label">Email <span aria-hidden="true">*</span></label>
        <input id="email" type="email" className="input" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-err" : undefined} required />
        {errors.email && <p id="email-err" className="error" role="alert">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="whatsapp" className="label">WhatsApp number (optional)</label>
        <input id="whatsapp" type="tel" className="input" autoComplete="tel" inputMode="tel" placeholder={country === "CA" ? "+1 416 555 0100" : "+91 98765 43210"} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} aria-invalid={Boolean(errors.whatsapp)} aria-describedby="whatsapp-help" />
        <p id="whatsapp-help" className="mt-1 text-xs text-muted">Include the country code.</p>
        {errors.whatsapp && <p className="error" role="alert">{errors.whatsapp}</p>}
      </div>

      <div>
        <label htmlFor="country" className="label">Country</label>
        <select id="country" className="input" value={country} onChange={(e) => setCountry(e.target.value as "IN" | "CA")}>
          <option value="IN">India</option>
          <option value="CA">Canada</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-5 w-5" checked={consentEmail} onChange={(e) => setConsentEmail(e.target.checked)} />
          <span>Send me drop updates by email</span>
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-5 w-5" checked={consentWa} onChange={(e) => setConsentWa(e.target.checked)} />
          <span>Send me drop updates on WhatsApp</span>
        </label>
      </div>

      <p className="text-xs text-muted">
        We store your email, size and country so we can tell you about this drop. See the{" "}
        <Link href="/privacy" className="underline">Privacy Policy</Link>.
      </p>

      {errors.form && <p className="error" role="alert">{errors.form}</p>}
      <button type="submit" className="btn btn-primary w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : label("notify_me")}
      </button>
    </form>
  );
}
