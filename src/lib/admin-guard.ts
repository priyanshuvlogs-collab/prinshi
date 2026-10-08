import "server-only";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
