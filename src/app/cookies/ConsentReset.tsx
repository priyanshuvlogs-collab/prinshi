"use client";
import { writeConsent } from "@/lib/consent";

export function ConsentReset() {
  return (
    <div className="flex gap-3">
      <button type="button" className="btn btn-secondary" onClick={() => { writeConsent({ analytics: false, marketing: false }); window.location.reload(); }}>Reject all</button>
      <button type="button" className="btn btn-primary" onClick={() => { writeConsent({ analytics: true, marketing: true }); window.location.reload(); }}>Accept all</button>
    </div>
  );
}
