import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-fg bg-fg text-bg">
      <div className="container-x grid gap-8 py-10 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-black uppercase">{site.name}</p>
          <p className="mt-2 text-sm text-bg/80">{site.originLine}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li><Link href="/drops" className="hover:underline">Drops</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Link href="/size-guide" className="hover:underline">Size guide</Link></li>
            <li><Link href="/shipping-returns" className="hover:underline">Shipping and returns</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy policy</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms</Link></li>
            <li><Link href="/cookies" className="hover:underline">Cookie notice</Link></li>
          </ul>
        </nav>
        <div className="text-sm text-bg/80">
          {site.contact.email && (
            <p><a className="hover:underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>
          )}
          {site.contact.instagram && (
            <p><a className="hover:underline" href={`https://instagram.com/${site.contact.instagram}`} rel="noopener noreferrer" target="_blank">@{site.contact.instagram}</a></p>
          )}
          <p className="mt-4">&copy; {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
