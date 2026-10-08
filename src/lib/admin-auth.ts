import "server-only";
import { cookies } from "next/headers";
import { signToken, verifyToken } from "@/lib/tokens";

const COOKIE = "prinshi_admin";

export async function isAdmin(): Promise<boolean> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return false;
  return verifyToken<{ role: string }>(c)?.role === "admin";
}

export async function loginAdmin(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) return false;
  const exp = Math.floor(Date.now() / 1000) + 12 * 3600;
  (await cookies()).set(COOKIE, signToken({ role: "admin", exp }), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 12 * 3600,
  });
  return true;
}

export async function logoutAdmin() {
  (await cookies()).delete(COOKIE);
}
