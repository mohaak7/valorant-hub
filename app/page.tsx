import type { Metadata } from "next";
import Link from "next/link";
import { fetchWeapons } from "@/lib/valorant-api";
import { TacticalCard } from "@/components/TacticalCard";
import { seoKeywordsBase } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Find cheap Valorant skin prices & VP cost",
  description:
    "Search any Valorant skin price instantly. View VP cost estimates and track cheap Valorant skins. Agents, bundles, guides, crosshairs.",
  keywords: [
    ...seoKeywordsBase,
    "find any Valorant skin price",
    "Valorant skin price tracker",
  ],
};

export const revalidate = 86400;

export default async function Home() {
  const weapons = await fetchWeapons();
  const vandal = weapons.find((w) => w.displayName === "Vandal");
  const topSkins = vandal?.skins?.filter((s) => !s.displayName?.match(/Level \d+/)).slice(0, 8) ?? [];

  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="glitch-hover text-balance text-3xl font-bold uppercase tracking-[0.12em] text-[#ece8e1] sm:text-4xl md:text-5xl">
          <span className="glitch-text">Find any Valorant skin price</span>
        </h1>
        <p className="mt-4 text-sm uppercase tracking-widest text-[#ece8e1]/70 sm:text-base">
          Skins database · Agents · Bundles · Crosshairs
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <form
          action="/skins"
          method="get"
          className="clip-tactical border-2 border-[#ece8e1]/30 bg-[#0f1923] p-2"
        >
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="text-[#ece8e1]/50">🔍</span>
            <input
              type="search"
              name="q"
              placeholder="Search skins (e.g. Reaver, Prime)..."
              className="flex-1 bg-transparent text-sm font-medium uppercase tracking-wider text-[#ece8e1] placeholder:text-[#ece8e1]/40 focus:outline-none"
            />
            <button
              type="submit"
              className="border-2 border-[#ff4655] bg-[#ff4655] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0f1923] transition hover:bg-[#ece8e1]"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#ece8e1]/70">
          Top tracked — Vandal
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topSkins.map((skin) => (
            <Link key={skin.uuid} href={`/skins/${skin.uuid}`}>
              <TacticalCard className="h-full" glitch>
                <div className="flex flex-col gap-2">
                  <div className="relative aspect-[2/1] w-full border border-[#ece8e1]/20 bg-[#0f1923]">
                    {(skin.displayIcon || skin.chromas?.[0]?.displayIcon) && (
                      <img
                        src={skin.displayIcon || skin.chromas?.[0]?.displayIcon!}
                        alt=""
                        className="h-full w-full object-contain p-2"
                      />
                    )}
                  </div>
                  <p className="truncate text-xs font-bold uppercase tracking-wider text-[#ece8e1]">
                    {skin.displayName}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-[#ece8e1]/50">
                    Vandal
                  </p>
                </div>
              </TacticalCard>
            </Link>
          ))}
        </div>
        <Link
          href="/skins"
          className="inline-block border-2 border-[#ff4655] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#ff4655] transition hover:bg-[#ff4655] hover:text-[#0f1923]"
        >
          All skins →
        </Link>
      </section>
    </section>
  );
}
