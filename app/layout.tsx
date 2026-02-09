import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { siteConfig, seoKeywordsBase } from "@/lib/siteConfig";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.siteName} | Cheap VP Cost Database`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.siteDescription,
  keywords: seoKeywordsBase,
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/agents", label: "Agents" },
  { href: "/skins", label: "Skins" },
  { href: "/bundles", label: "Bundles" },
  { href: "/crosshairs", label: "Crosshairs" },
  { href: "/tools/agent-roulette", label: "Agent Roulette" },
  { href: "/tools/skin-roulette", label: "Skin Roulette" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0f1923] text-[#ece8e1] antialiased">
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-6 flex items-center justify-between gap-4 border-b border-[#ece8e1]/20 pb-4">
            <Link
              href="/"
              className="flex items-center gap-3 border-2 border-[#ff4655] bg-[#0f1923] px-3 py-1.5 transition hover:bg-[#ff4655] hover:text-[#0f1923]"
            >
              <span className="text-lg font-bold tracking-widest text-[#ff4655]">
                VS
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Valorant Skins DB
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-[#ece8e1]/70">
                  Price &amp; VP Tracker
                </span>
              </div>
            </Link>
            <nav className="flex flex-wrap items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="glitch-hover border border-transparent px-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ece8e1]/80 transition hover:border-[#ff4655] hover:bg-[#ff4655]/10 hover:text-[#ece8e1]"
                >
                  <span className="glitch-text">{label}</span>
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-8 border-t border-[#ece8e1]/20 pt-4 text-[11px] uppercase tracking-widest text-[#ece8e1]/50">
            Unofficial Valorant fan project. Valorant is a trademark of Riot
            Games.
          </footer>
        </div>
      </body>
    </html>
  );
}
