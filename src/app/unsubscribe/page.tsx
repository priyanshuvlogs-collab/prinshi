import type { Metadata } from "next";
import Link from "next/link";
import { getStore } from "@/lib/store";
import { verifyToken } from "@/lib/tokens";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false } };

export default async function UnsubscribePage({ searchParams }: PageProps<"/unsubscribe">) {
  const { token } = await searchParams;
  const data = typeof token === "string" ? verifyToken<{ sid: string; act: string }>(token) : null;
  let ok = false;
  if (data?.act === "unsub") {
    const s = await getStore().getSignup(data.sid);
    if (s) {
      await getStore().updateSignup(s.id, { unsubscribed_at: new Date().toISOString(), consent_email: false, consent_whatsapp: false });
      ok = true;
    }
  }
  return (
    <div className="container-x max-w-xl py-16 text-center">
      <h1 className="font-heading text-3xl font-black uppercase">{ok ? "Unsubscribed" : "Link not valid"}</h1>
      <p className="mt-4">{ok ? "You will not get further emails from this list." : "This link is missing or not valid. Write to us using the Contact page and we will remove you by hand."}</p>
      <Link href="/" className="btn btn-primary mt-8">Home</Link>
    </div>
  );
}
