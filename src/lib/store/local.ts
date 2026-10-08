import { promises as fs } from "node:fs";
import path from "node:path";
import type { Drop, DropCounts, Poll, Signup, Vote } from "@/lib/types";
import type { Store } from "./types";
import seed from "../../../content/drops.seed.json";

/**
 * File-backed store for local development and previews.
 * Data lives in .data/store.json (gitignored). Not for production:
 * Vercel's filesystem is read-only, so configure Supabase there.
 */
interface Db {
  drops: Drop[];
  signups: Signup[];
  polls: Poll[];
  votes: Vote[];
}

const FILE = path.join(process.cwd(), ".data", "store.json");
let writing: Promise<void> = Promise.resolve();

// Always read from disk: route bundles do not share module state, so an in-memory cache goes stale.
async function load(): Promise<Db> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Db;
  } catch {
    return { drops: seed as Drop[], signups: [], polls: [], votes: [] };
  }
}

async function save(db: Db) {
  writing = writing.then(async () => {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(db, null, 2));
  });
  await writing;
}

export const localStore: Store = {
  async listDrops() {
    const db = await load();
    return [...db.drops].sort((a, b) => b.created_at.localeCompare(a.created_at));
  },
  async getDrop(idOrSlug) {
    const db = await load();
    return db.drops.find((d) => d.id === idOrSlug || d.slug === idOrSlug) ?? null;
  },
  async upsertDrop(drop) {
    const db = await load();
    const i = db.drops.findIndex((d) => d.id === drop.id);
    if (i >= 0) db.drops[i] = drop;
    else db.drops.push(drop);
    await save(db);
    return drop;
  },
  async deleteDrop(id) {
    const db = await load();
    db.drops = db.drops.filter((d) => d.id !== id);
    await save(db);
  },
  async createSignup(signup) {
    const db = await load();
    db.signups.push(signup);
    await save(db);
    return signup;
  },
  async findSignup(email, productId) {
    const db = await load();
    return (
      db.signups.find(
        (s) => s.email.toLowerCase() === email.toLowerCase() && s.product_id === productId,
      ) ?? null
    );
  },
  async getSignup(id) {
    const db = await load();
    return db.signups.find((s) => s.id === id) ?? null;
  },
  async updateSignup(id, patch) {
    const db = await load();
    const i = db.signups.findIndex((s) => s.id === id);
    if (i < 0) return null;
    db.signups[i] = { ...db.signups[i], ...patch };
    await save(db);
    return db.signups[i];
  },
  async listSignups() {
    const db = await load();
    return [...db.signups].sort((a, b) => b.created_at.localeCompare(a.created_at));
  },
  async countsPerDrop() {
    const db = await load();
    const map = new Map<string, DropCounts>();
    for (const s of db.signups) {
      const c = map.get(s.product_id) ?? { product_id: s.product_id, signups: 0, confirmed: 0 };
      c.signups += 1;
      if (s.email_confirmed_at) c.confirmed += 1;
      map.set(s.product_id, c);
    }
    return [...map.values()];
  },
  async listPolls() {
    const db = await load();
    return [...db.polls].sort((a, b) => b.created_at.localeCompare(a.created_at));
  },
  async getPoll(id) {
    const db = await load();
    return db.polls.find((p) => p.id === id) ?? null;
  },
  async upsertPoll(poll) {
    const db = await load();
    const i = db.polls.findIndex((p) => p.id === poll.id);
    if (i >= 0) db.polls[i] = poll;
    else db.polls.push(poll);
    await save(db);
    return poll;
  },
  async createVote(vote) {
    const db = await load();
    db.votes.push(vote);
    await save(db);
    return vote;
  },
  async findVote(pollId, email) {
    const db = await load();
    return (
      db.votes.find((v) => v.poll_id === pollId && v.email.toLowerCase() === email.toLowerCase()) ??
      null
    );
  },
  async voteCounts(pollId) {
    const db = await load();
    const counts: Record<string, number> = {};
    for (const v of db.votes) {
      if (v.poll_id !== pollId) continue;
      counts[v.option_id] = (counts[v.option_id] ?? 0) + 1;
    }
    return counts;
  },
};
