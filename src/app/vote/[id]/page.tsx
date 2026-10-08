import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStore } from "@/lib/store";
import { VoteForm } from "./VoteForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Design vote", robots: { index: false } };

export default async function VotePage({ params }: PageProps<"/vote/[id]">) {
  const { id } = await params;
  const store = getStore();
  const poll = await store.getPoll(id);
  if (!poll) notFound();
  const closed = new Date(poll.closes_at) < new Date();
  const counts = closed ? await store.voteCounts(poll.id) : null;
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="font-heading text-3xl font-black uppercase">{poll.title}</h1>
      <p className="mt-2 text-muted">
        {closed ? "This poll has closed. Results are real vote counts." : `Vote closes ${new Date(poll.closes_at).toLocaleDateString("en-CA")}. One vote per email.`}
      </p>
      {closed ? (
        <ul className="mt-6 space-y-3">
          {poll.options.map((o) => (
            <li key={o.id} className="flex items-center justify-between border-2 border-fg bg-card p-4">
              <span className="font-bold">{o.label}</span>
              <span className="font-heading text-xl">{counts?.[o.id] ?? 0}</span>
            </li>
          ))}
        </ul>
      ) : (
        <VoteForm poll={poll} />
      )}
    </div>
  );
}
