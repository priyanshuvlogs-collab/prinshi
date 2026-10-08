"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function DropViewTracker({ productId }: { productId: string }) {
  useEffect(() => { track("drop_view", { product_id: productId }); }, [productId]);
  return null;
}

export function WhatsAppLink({ number, className, children }: { number: string; className?: string; children: React.ReactNode }) {
  const href = `https://wa.me/${number.replace(/[^\d]/g, "")}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={() => track("whatsapp_click")}>
      {children}
    </a>
  );
}

export function OutboundLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={() => track("outbound_click", { href })}>
      {children}
    </a>
  );
}

export function SizeGuideLink({ href = "/size-guide", className, children }: { href?: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} className={className} onClick={() => track("size_guide_open")}>
      {children}
    </a>
  );
}
