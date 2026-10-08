import Link from "next/link";
import { requireAdmin } from "@/lib/admin-guard";
import { getStore } from "@/lib/store";

export default async function AdminHome() {
  await requireAdmin();
  const store = getStore();
  const [drops, counts, signups] = await Promise.all([store.listDrops(), store.countsPerDrop(), store.listSignups()]);
  const byId = new Map(counts.map((c) => [c.product_id, c]));
  const byCountry = signups.reduce<Record<string, number>>((m, s) => ((m[s.country] = (m[s.country] ?? 0) + 1), m), {});
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = signups.filter((s) => s.created_at.startsWith(today)).length;

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Sign-ups" value={signups.length} />
        <Stat label="Today" value={todayCount} />
        <Stat label="India" value={byCountry.IN ?? 0} />
        <Stat label="Canada" value={byCountry.CA ?? 0} />
      </section>
      <section>
        <h1 className="font-heading text-2xl font-black uppercase">Drops</h1>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b-2 border-fg"><th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Category</th><th className="py-2 pr-3">Stock</th><th className="py-2 pr-3">Sign-ups</th><th className="py-2 pr-3">Confirmed</th><th className="py-2">Sample</th></tr></thead>
            <tbody>
              {drops.map((d) => (
                <tr key={d.id} className="border-b border-line">
                  <td className="py-2 pr-3"><Link href={`/admin/drops/${d.id}`} className="font-semibold underline">{d.name}</Link></td>
                  <td className="py-2 pr-3">{d.category}</td>
                  <td className="py-2 pr-3">{d.stock_state}</td>
                  <td className="py-2 pr-3">{byId.get(d.id)?.signups ?? 0}</td>
                  <td className="py-2 pr-3">{byId.get(d.id)?.confirmed ?? 0}</td>
                  <td className="py-2">{d.sample ? "yes" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-2 border-fg bg-card p-4">
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="font-heading text-3xl">{value}</p>
    </div>
  );
}
