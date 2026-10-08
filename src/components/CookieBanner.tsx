"use client";
import Link from "next/link";
import { useConsent, writeConsent } from "@/lib/consent";

export function CookieBanner() {
  const consent = useConsent();
  if (consent !== null) return null; // "unknown" during SSR, or a choice already made

  const decide = (all: boolean) => writeConsent({ analytics: all, marketing: all });

  return (
    <div role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-desc" className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-fg bg-card p-4 shadow-lg">
      <div className="container-x flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p id="cookie-title" className="font-bold">Cookies</p>
          <p id="cookie-desc" className="text-sm">
            We use analytics cookies to count visits and see which drops people look at. Nothing loads until you choose.{" "}
            <Link href="/cookies" className="underline">Cookie notice</Link>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="btn btn-secondary" onClick={() => decide(false)}>Reject all</button>
          <button type="button" className="btn btn-primary" onClick={() => decide(true)}>Accept all</button>
        </div>
      </div>
    </div>
  );
}
