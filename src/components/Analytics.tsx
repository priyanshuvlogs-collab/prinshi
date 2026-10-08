"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useConsent } from "@/lib/consent";

/** Loads GA4 (and Meta Pixel when configured) only after analytics consent. */
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA4_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const consent = useConsent();
  const ok = consent !== "unknown" && Boolean(consent?.analytics);
  const pathname = usePathname();

  useEffect(() => {
    if (ok && ga) window.gtag?.("event", "page_view", { page_path: pathname });
  }, [ok, ga, pathname]);

  if (!ok) return null;
  return (
    <>
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${ga}', { send_page_view: false, anonymize_ip: true });
          `}</Script>
        </>
      )}
      {pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixel}'); fbq('track', 'PageView');
        `}</Script>
      )}
    </>
  );
}
