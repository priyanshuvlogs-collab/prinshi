import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x max-w-xl py-24 text-center">
      <p className="font-heading text-7xl font-black">404</p>
      <h1 className="mt-2 font-heading text-2xl font-black uppercase">Nothing here</h1>
      <p className="mt-4 text-muted">The page moved or never existed.</p>
      <Link href="/drops" className="btn btn-primary mt-8">See the drops</Link>
    </div>
  );
}
