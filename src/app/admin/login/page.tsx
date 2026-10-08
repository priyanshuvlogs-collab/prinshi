import { redirect } from "next/navigation";
import { loginAdmin } from "@/lib/admin-auth";

export default async function AdminLogin({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;
  async function login(formData: FormData) {
    "use server";
    const ok = await loginAdmin(String(formData.get("password") ?? ""));
    redirect(ok ? "/admin" : "/admin/login?error=1");
  }
  return (
    <form action={login} className="max-w-sm space-y-4">
      <h1 className="font-heading text-2xl font-black uppercase">Admin login</h1>
      {!process.env.ADMIN_PASSWORD && <p className="error">ADMIN_PASSWORD is not set. Add it to .env.local.</p>}
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" className="input" autoComplete="current-password" required />
        {error && <p className="error" role="alert">Wrong password.</p>}
      </div>
      <button className="btn btn-primary" type="submit">Log in</button>
    </form>
  );
}
