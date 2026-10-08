import { NextResponse } from "next/server";
import { confirmEmail, sendEmail } from "@/lib/email";
import { newId } from "@/lib/format";
import { forwardToGhl } from "@/lib/ghl";
import { site } from "@/lib/site";
import { getStore } from "@/lib/store";
import { signToken } from "@/lib/tokens";
import { SIZES, type Signup, type Size } from "@/lib/types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const E164 = /^\+[1-9]\d{6,14}$/;

// Very small in-memory rate limit per IP (resets on cold start). Good enough for Phase 1.
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n += 1;
  return h.n > 10;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });

  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const email = String(body.email ?? "").trim().toLowerCase();
  const size = String(body.size ?? "") as Size;
  const productId = String(body.product_id ?? "");
  const whatsapp = body.whatsapp ? String(body.whatsapp).replace(/[\s-]/g, "") : null;
  const country = body.country === "CA" ? "CA" : "IN";
  const consentEmail = body.consent_email === true;
  const consentWa = body.consent_whatsapp === true;

  if (!EMAIL.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!SIZES.includes(size)) return NextResponse.json({ error: "Choose a size." }, { status: 400 });
  if (whatsapp && !E164.test(whatsapp)) return NextResponse.json({ error: "WhatsApp number must start with + and the country code." }, { status: 400 });
  if (consentWa && !whatsapp) return NextResponse.json({ error: "Add a WhatsApp number to get WhatsApp updates." }, { status: 400 });

  const store = getStore();
  const drop = await store.getDrop(productId);
  if (!drop) return NextResponse.json({ error: "Unknown drop." }, { status: 404 });
  if (!drop.sizes.includes(size)) return NextResponse.json({ error: "That size is not offered for this drop." }, { status: 400 });

  const now = new Date().toISOString();
  const existing = await store.findSignup(email, drop.id);
  let signup: Signup;
  if (existing) {
    // Re-submit: update preferences, keep original consent timestamps where consent was already given.
    signup = (await store.updateSignup(existing.id, {
      size,
      whatsapp: whatsapp ?? existing.whatsapp,
      country,
      consent_email: consentEmail,
      consent_email_at: consentEmail ? (existing.consent_email_at ?? now) : null,
      consent_whatsapp: consentWa,
      consent_whatsapp_at: consentWa ? (existing.consent_whatsapp_at ?? now) : null,
      unsubscribed_at: null,
    }))!;
  } else {
    signup = await store.createSignup({
      id: newId("su"),
      email,
      whatsapp,
      product_id: drop.id,
      size,
      country,
      utm_source: str(body.utm_source),
      utm_medium: str(body.utm_medium),
      utm_campaign: str(body.utm_campaign),
      consent_email: consentEmail,
      consent_email_at: consentEmail ? now : null,
      consent_whatsapp: consentWa,
      consent_whatsapp_at: consentWa ? now : null,
      email_confirmed_at: null,
      unsubscribed_at: null,
      created_at: now,
    });
  }

  if (!signup.email_confirmed_at) {
    const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
    const confirmUrl = `${site.url}/confirm?token=${signToken({ sid: signup.id, act: "confirm", exp })}`;
    const unsubscribeUrl = `${site.url}/unsubscribe?token=${signToken({ sid: signup.id, act: "unsub" })}`;
    const mail = confirmEmail({ productName: drop.name, confirmUrl, unsubscribeUrl });
    await sendEmail({ to: email, ...mail, unsubscribeUrl });
  }

  void forwardToGhl(signup, drop.name);
  return NextResponse.json({ ok: true });
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, 200) : null;
}
