import type { Drop, DropCounts, Poll, Signup, Vote } from "@/lib/types";

export interface Store {
  listDrops(): Promise<Drop[]>;
  getDrop(idOrSlug: string): Promise<Drop | null>;
  upsertDrop(drop: Drop): Promise<Drop>;
  deleteDrop(id: string): Promise<void>;

  createSignup(signup: Signup): Promise<Signup>;
  findSignup(email: string, productId: string): Promise<Signup | null>;
  getSignup(id: string): Promise<Signup | null>;
  updateSignup(id: string, patch: Partial<Signup>): Promise<Signup | null>;
  listSignups(): Promise<Signup[]>;
  countsPerDrop(): Promise<DropCounts[]>;

  listPolls(): Promise<Poll[]>;
  getPoll(id: string): Promise<Poll | null>;
  upsertPoll(poll: Poll): Promise<Poll>;
  createVote(vote: Vote): Promise<Vote>;
  findVote(pollId: string, email: string): Promise<Vote | null>;
  voteCounts(pollId: string): Promise<Record<string, number>>;
}
