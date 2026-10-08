import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Drop, DropCounts, Poll, Signup, Vote } from "@/lib/types";
import type { Store } from "./types";

/**
 * Supabase-backed store. Uses the service role key on the server only.
 * Schema: supabase/migrations/0001_init.sql
 */
export function createSupabaseStore(url: string, serviceKey: string): Store {
  const sb: SupabaseClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  function must<T>(res: { data: T | null; error: { message: string } | null }): T {
    if (res.error) throw new Error(res.error.message);
    return res.data as T;
  }

  return {
    async listDrops() {
      return must(await sb.from("drops").select("*").order("created_at", { ascending: false }));
    },
    async getDrop(idOrSlug) {
      const res = await sb
        .from("drops")
        .select("*")
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle();
      return must<Drop | null>(res);
    },
    async upsertDrop(drop) {
      return must(await sb.from("drops").upsert(drop).select("*").single());
    },
    async deleteDrop(id) {
      must(await sb.from("drops").delete().eq("id", id));
    },
    async createSignup(signup) {
      return must(await sb.from("signups").insert(signup).select("*").single());
    },
    async findSignup(email, productId) {
      return must<Signup | null>(
        await sb
          .from("signups")
          .select("*")
          .ilike("email", email)
          .eq("product_id", productId)
          .maybeSingle(),
      );
    },
    async getSignup(id) {
      return must<Signup | null>(await sb.from("signups").select("*").eq("id", id).maybeSingle());
    },
    async updateSignup(id, patch) {
      return must<Signup | null>(
        await sb.from("signups").update(patch).eq("id", id).select("*").maybeSingle(),
      );
    },
    async listSignups() {
      return must(await sb.from("signups").select("*").order("created_at", { ascending: false }));
    },
    async countsPerDrop() {
      const rows = must<Pick<Signup, "product_id" | "email_confirmed_at">[]>(
        await sb.from("signups").select("product_id,email_confirmed_at"),
      );
      const map = new Map<string, DropCounts>();
      for (const s of rows) {
        const c = map.get(s.product_id) ?? { product_id: s.product_id, signups: 0, confirmed: 0 };
        c.signups += 1;
        if (s.email_confirmed_at) c.confirmed += 1;
        map.set(s.product_id, c);
      }
      return [...map.values()];
    },
    async listPolls() {
      return must(await sb.from("polls").select("*").order("created_at", { ascending: false }));
    },
    async getPoll(id) {
      return must<Poll | null>(await sb.from("polls").select("*").eq("id", id).maybeSingle());
    },
    async upsertPoll(poll) {
      return must(await sb.from("polls").upsert(poll).select("*").single());
    },
    async createVote(vote) {
      return must(await sb.from("votes").insert(vote).select("*").single());
    },
    async findVote(pollId, email) {
      return must<Vote | null>(
        await sb.from("votes").select("*").eq("poll_id", pollId).ilike("email", email).maybeSingle(),
      );
    },
    async voteCounts(pollId) {
      const rows = must<Pick<Vote, "option_id">[]>(
        await sb.from("votes").select("option_id").eq("poll_id", pollId),
      );
      const counts: Record<string, number> = {};
      for (const v of rows) counts[v.option_id] = (counts[v.option_id] ?? 0) + 1;
      return counts;
    },
  };
}
