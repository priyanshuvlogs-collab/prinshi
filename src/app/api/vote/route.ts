import { NextResponse } from "next/server";
import { newId } from "@/lib/format";
import { getStore } from "@/lib/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const pollId = String(body.poll_id ?? "");
  const optionId = String(body.option_id ?? "");
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  const store = getStore();
  const poll = await store.getPoll(pollId);
  if (!poll) return NextResponse.json({ error: "Poll not found." }, { status: 404 });
  if (new Date(poll.closes_at) < new Date()) return NextResponse.json({ error: "This poll has closed." }, { status: 400 });
  if (!poll.options.some((o) => o.id === optionId)) return NextResponse.json({ error: "Pick a design." }, { status: 400 });
  if (await store.findVote(poll.id, email)) return NextResponse.json({ error: "This email has already voted." }, { status: 409 });

  await store.createVote({ id: newId("v"), poll_id: poll.id, option_id: optionId, email, created_at: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
