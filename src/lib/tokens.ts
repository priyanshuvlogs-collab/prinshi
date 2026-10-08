import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

function secret(): string {
  const s = process.env.APP_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === "production") throw new Error("APP_SECRET is not set");
    return "dev-only-secret-change-me";
  }
  return s;
}

/** Signs a payload: base64url(json).base64url(hmac). Used for confirm and unsubscribe links. */
export function signToken(payload: Record<string, string | number>): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken<T extends Record<string, string | number>>(token: string): T | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T & { exp?: number };
    if (parsed.exp && Date.now() / 1000 > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}
