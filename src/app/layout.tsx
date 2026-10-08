import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrefsProvider } from "@/components/Prefs";
import { site, type Country } from "@/lib/site";

const heading = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-heading", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}. ${site.tagline}`, template: `%s | ${site.name}` },
  description: `${site.tagline} Oversized tees and 400 GSM hoodies. ${site.originLine}`,
  openGraph: { siteName: site.name, type: "website" },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const h = await headers();
  const geo = h.get("x-vercel-ip-country");
  const initialCountry: Country = geo === "CA" ? "CA" : "IN";
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-fg focus:px-3 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        <PrefsProvider initialCountry={initialCountry}>
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
          <Analytics />
        </PrefsProvider>
      </body>
    </html>
  );
}
