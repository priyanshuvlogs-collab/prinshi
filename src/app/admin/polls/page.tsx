import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { newId } from "@/lib/format";
import { getStore } from "@/lib/store";

export default async function PollsAdmin() {
  await requireAdmin();
  const store = getStore();
  const polls = await store.listPolls();
  const counts = await Promise.all(polls.map((p) => store.voteCounts(p.id)));

  async function create(formData: FormData) {
    "use server";
    await requireAdmin();
    const g = (k: string) => String(formData.get(k) ?? "").trim();
    const options = [1, 2, 3]
      .map((i) => ({ id: `opt${i}`, label: g(`label${i}`), image: g(`image${i}`) || null }))
      .filter((o) => o.label);
    if (!g("title") || options.length < 2 || !g("closes_at")) redirect("/admin/polls?error=1");
    await getStore().upsertPoll({ id: newId("poll"), title: g("title"), options, closes_at: new Date(g("closes_at")).toISOString(), created_at: new Date().toISOString() });
    redirect("/admin/polls");
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-heading text-2xl font-black uppercase">Design votes</h1>
        <ul className="mt-3 space-y-2">
          {polls.map((p, i) => (
            <li key={p.id} className="border-2 border-fg bg-card p-3">
              <p className="font-bold">{p.title} <Link className="ml-2 text-sm underline" href={`/vote/${p.id}`}>public link</Link></p>
              <p className="text-sm text-muted">Closes {new Date(p.closes_at).toLocaleString("en-CA")}</p>
              <ul className="mt-1 text-sm">{p.options.map((o) => <li key={o.id}>{o.label}: {counts[i][o.id] ?? 0}</li>)}</ul>
            </li>
          ))}
          {!polls.length && <li className="text-muted">No polls yet.</li>}
        </ul>
      </section>
      <form action={create} className="grid max-w-xl gap-3">
        <h2 className="font-heading text-xl font-bold">New poll (up to 3 mockups)</h2>
        <div><label className="label" htmlFor="title">Title</label><input id="title" name="title" className="input" required /></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <div><label className="label" htmlFor={`label${i}`}>Option {i} label</label><input id={`label${i}`} name={`label${i}`} className="input" /></div>
            <div><label className="label" htmlFor={`image${i}`}>Image path</label><input id={`image${i}`} name={`image${i}`} className="input" placeholder="/images/..." /></div>
          </div>
        ))}
        <div><label className="label" htmlFor="closes_at">Closes at</label><input id="closes_at" name="closes_at" type="datetime-local" className="input" required /></div>
        <button className="btn btn-primary" type="submit">Create poll</button>
      </form>
    </div>
  );
}
