"use client";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";
import { usePrefs } from "./Prefs";

const nav = [
  { href: "/drops", label: "Drops" },
  { href: "/about", label: "About" },
  { href: "/size-guide", label: "Size guide", key: "size_guide" as const },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, country, setCountry, label } = usePrefs();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-fg bg-bg/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="font-heading text-xl font-black uppercase tracking-tight">
          {site.name}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-base font-semibold hover:underline">
              {n.key ? label(n.key) : n.label}
            </Link>
          ))}
          <Switches lang={lang} setLang={setLang} country={country} setCountry={setCountry} />
        </nav>
        <button
          type="button"
          className="btn btn-secondary h-11 min-h-0 px-3 py-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t-2 border-fg bg-bg md:hidden">
          <ul className="container-x flex flex-col py-2">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className="block py-3 text-lg font-semibold">
                  {n.key ? label(n.key) : n.label}
                </Link>
              </li>
            ))}
            <li className="py-3">
              <Switches lang={lang} setLang={setLang} country={country} setCountry={setCountry} />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function Switches(props: {
  lang: "en" | "fr";
  setLang: (l: "en" | "fr") => void;
  country: "IN" | "CA";
  setCountry: (c: "IN" | "CA") => void;
}) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold">
      <label className="flex items-center gap-1">
        <span className="sr-only">Country and currency</span>
        <select
          className="border-2 border-fg bg-bg px-2 py-1"
          value={props.country}
          onChange={(e) => props.setCountry(e.target.value as "IN" | "CA")}
        >
          <option value="IN">IN · INR</option>
          <option value="CA">CA · CAD</option>
        </select>
      </label>
      <button
        type="button"
        className="border-2 border-fg px-2 py-1 uppercase"
        aria-pressed={props.lang === "fr"}
        onClick={() => props.setLang(props.lang === "en" ? "fr" : "en")}
        aria-label={props.lang === "en" ? "Switch to French labels" : "Passer aux libellés anglais"}
      >
        {props.lang === "en" ? "FR" : "EN"}
      </button>
    </div>
  );
}
