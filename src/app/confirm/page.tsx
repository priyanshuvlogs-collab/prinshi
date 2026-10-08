import type { Metadata } from "next";
import Link from "next/link";
import { getStore } from "@/lib/store";
import { verifyToken } from "@/lib/tokens";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Confirm your email", robots: { index: false } };

export default async function ConfirmPage({ searchParams }: PageProps<"/confirm">) {
  const { token } = await searchParams;
  const data = typeof token === "string" ? verifyToken<{ sid: string; act: string }>(token) : null;
  let ok = false;
  if (data?.act === "confirm") {
    const s = await getStore().getSignup(data.sid);
    if (s) {
      if (!s.email_confirmed_at) await getStore().updateSignup(s.id, { email_confirmed_at: new Date().toISOString() });
      ok = true;
    }
  }
  return (
    <div className="container-x max-w-xl py-16 text-center">
      <h1 className="font-heading text-3xl font-black uppercase">{ok ? "Email confirmed" : "Link not valid"}</h1>
      <p className="mt-4">{ok ? "You will hear from us when the drop goes live." : "This confirmation link is missing, expired or already used. Sign up again on the drop page if you still want updates."}</p>
      <Link href="/drops" className="btn btn-primary mt-8">Back to drops</Link>
    </div>
  );
}
