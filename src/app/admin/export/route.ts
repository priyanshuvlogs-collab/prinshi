import { isAdmin } from "@/lib/admin-auth";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const store = getStore();
  const [signups, drops] = await Promise.all([store.listSignups(), store.listDrops()]);
  const names = new Map(drops.map((d) => [d.id, d.name]));
  const cols = ["id", "email", "whatsapp", "product_id", "product_name", "size", "country", "utm_source", "utm_medium", "utm_campaign", "consent_email", "consent_email_at", "consent_whatsapp", "consent_whatsapp_at", "email_confirmed_at", "unsubscribed_at", "created_at"] as const;
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [cols.join(",")];
  for (const s of signups) {
    const row = { ...s, product_name: names.get(s.product_id) ?? "" } as Record<string, unknown>;
    lines.push(cols.map((c) => esc(row[c])).join(","));
  }
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="signups-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
