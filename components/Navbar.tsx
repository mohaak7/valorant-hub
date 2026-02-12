"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/lang-context";
import { LanguageToggle } from "@/components/LanguageToggle";

const NAV_LINKS = [
  { href: "/", key: "home" as const },
  { href: "/agents", key: "agents" as const },
  { href: "/skins", key: "skins" as const },
  { href: "/bundles", key: "bundles" as const },
  { href: "/crosshairs", key: "crosshairs" as const },
  { href: "/tools/agent-roulette", key: "agentRoulette" as const },
  { href: "/tools/skin-roulette", key: "skinRoulette" as const },
];

export function Navbar() {
  const { t } = useLanguage();

  return (
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
            Skins • Agents • Crosshairs
          </span>
        </div>
      </Link>
      <nav className="flex flex-1 flex-wrap items-center justify-end gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {NAV_LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="glitch-hover border border-transparent px-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ece8e1]/80 transition hover:border-[#ff4655] hover:bg-[#ff4655]/10 hover:text-[#ece8e1]"
            >
              <span className="glitch-text">
                {t.nav[key]}
              </span>
            </Link>
          ))}
        </div>
        <LanguageToggle />
      </nav>
    </header>
  );
}

