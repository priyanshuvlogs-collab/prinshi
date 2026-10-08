import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin, logoutAdmin } from "@/lib/admin-auth";
import { storeKind } from "@/lib/store";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Each admin page calls requireAdmin(); the login page is the only one that does not.
  const ok = await isAdmin();
  return (
    <div className="container-x py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-fg pb-3">
        <nav aria-label="Admin" className="flex gap-4 font-semibold">
          <Link href="/admin" className="hover:underline">Dashboard</Link>
          <Link href="/admin/drops/new" className="hover:underline">New drop</Link>
          <Link href="/admin/polls" className="hover:underline">Polls</Link>
          <a href="/admin/export" className="hover:underline">Export CSV</a>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted">Store: {storeKind()}</span>
          {ok && (
            <form action={async () => { "use server"; await logoutAdmin(); redirect("/admin/login"); }}>
              <button className="underline" type="submit">Log out</button>
            </form>
          )}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
