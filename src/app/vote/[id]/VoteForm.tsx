"use client";
import Image from "next/image";
import { useState } from "react";
import type { Poll } from "@/lib/types";

export function VoteForm({ poll }: { poll: Poll }) {
  const [option, setOption] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!option) return setMsg({ ok: false, text: "Pick a design." });
    setBusy(true);
    const res = await fetch("/api/vote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ poll_id: poll.id, option_id: option, email }) });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setMsg(res.ok ? { ok: true, text: "Vote counted. Thanks." } : { ok: false, text: data.error ?? "Try again." });
    setBusy(false);
  }

  if (msg?.ok) return <p role="status" className="mt-6 border-2 border-fg bg-card p-4 font-bold">{msg.text}</p>;

  return (
    <form onSubmit={submit} noValidate className="mt-6 space-y-4">
      <fieldset>
        <legend className="label">Designs (mockups)</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {poll.options.map((o) => (
            <label key={o.id} className={`cursor-pointer border-2 bg-card p-2 ${option === o.id ? "border-fg" : "border-line"}`}>
              <input type="radio" name="option" value={o.id} className="sr-only" checked={option === o.id} onChange={() => setOption(o.id)} />
              {o.image && (
                <span className="relative block aspect-[4/5]">
                  <Image src={o.image} alt={`Mockup: ${o.label}`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                </span>
              )}
              <span className="mt-2 block font-bold">{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="vote-email" className="label">Email</label>
        <input id="vote-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      {msg && <p className="error" role="alert">{msg.text}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy}>Vote</button>
    </form>
  );
}
