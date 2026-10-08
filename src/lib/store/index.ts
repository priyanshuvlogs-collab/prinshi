import "server-only";
import type { Store } from "./types";
import { localStore } from "./local";
import { createSupabaseStore } from "./supabase";

let instance: Store | null = null;

/** Returns the configured store: Supabase when env is set, else the local JSON file. */
export function getStore(): Store {
  if (instance) return instance;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  instance = url && key ? createSupabaseStore(url, key) : localStore;
  return instance;
}

export function storeKind(): "supabase" | "local" {
  return process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "local";
}
