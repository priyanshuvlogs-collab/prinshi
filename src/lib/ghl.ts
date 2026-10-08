import "server-only";
import type { Signup } from "@/lib/types";

/** Forwards a sign-up to a GoHighLevel inbound webhook when GHL_WEBHOOK_URL is set. Fire and forget. */
export async function forwardToGhl(signup: Signup, productName: string): Promise<void> {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...signup, product_name: productName, source: "prinshi-site" }),
    });
    if (!res.ok) console.error("[ghl] webhook responded", res.status);
  } catch (err) {
    console.error("[ghl] webhook failed", err);
  }
}
