import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  fetchWeapons,
  fetchContentTiers,
  fetchAllSkins,
} from "@/lib/valorant-api";
import { TacticalCard } from "@/components/TacticalCard";
import { SkinsFilters } from "./SkinsFilters";

export const metadata: Metadata = {
  title: "Valorant Skins | Weapon Skins by Type & Tier",
  description:
    "Browse Valorant weapon skins. Filter by weapon type (Vandal, Phantom, Knife) and tier (Select, Deluxe, Premium).",
};

export const revalidate = 86400;

type PageProps = {
  searchParams: Promise<{ weapon?: string; tier?: string; q?: string }>;
};

export default async function SkinsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [weapons, tiers, allSkins] = await Promise.all([
    fetchWeapons(),
    fetchContentTiers(),
    fetchAllSkins(),
  ]);

  const weaponOptions = weapons
    .filter((w) => w.skins.length > 0)
    .map((w) => w.displayName)
    .sort((a, b) => a.localeCompare(b));

  const tierOptions = tiers.sort((a, b) => a.rank - b.rank);

  let filtered = allSkins;
  if (params.weapon)
    filtered = filtered.filter(
      (s) => s.weaponName.toLowerCase() === params.weapon!.toLowerCase()
    );
  if (params.tier)
    filtered = filtered.filter((s) => s.contentTierUuid === params.tier);
  if (params.q?.trim()) {
    const query = params.q.trim().toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.displayName.toLowerCase().includes(query) ||
        s.weaponName.toLowerCase().includes(query)
    );
  }

  const tierMap = new Map(tiers.map((t) => [t.uuid, t]));

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.15em] text-[#ece8e1] sm:text-4xl">
            Skins
          </h1>
          <p className="mt-2 text-sm uppercase tracking-widest text-[#ece8e1]/70">
            Filter by weapon type &amp; tier
          </p>
        </div>
        <SkinsFilters
          weaponOptions={weaponOptions}
          tierOptions={tierOptions}
          currentWeapon={params.weapon ?? ""}
          currentTier={params.tier ?? ""}
          currentQ={params.q ?? ""}
        />
      </div>

      <p className="text-[11px] uppercase tracking-widest text-[#ece8e1]/50">
        {filtered.length} skin{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.slice(0, 80).map((skin) => {
          const tier = tierMap.get(skin.contentTierUuid);
          const icon =
            skin.displayIcon ||
            skin.chromas?.[0]?.displayIcon ||
            skin.levels?.[0]?.displayIcon;
          return (
            <Link key={skin.uuid} href={`/skins/${skin.uuid}`}>
              <TacticalCard className="h-full" glitch>
                <div className="flex flex-col items-center gap-2">
                  <div className="relative aspect-[2/1] w-full border border-[#ece8e1]/20 bg-[#0f1923]">
                    {icon && (
                      <Image
                        src={icon}
                        alt={skin.displayName}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-contain p-2"
                      />
                    )}
                  </div>
                  <p className="w-full truncate text-center text-xs font-bold uppercase tracking-wider text-[#ece8e1]">
                    {skin.displayName}
                  </p>
                  <div className="flex w-full items-center justify-between gap-2 text-[10px] uppercase tracking-widest text-[#ece8e1]/60">
                    <span>{skin.weaponName}</span>
                    {tier && (
                      <span className="text-[#ff4655]/90">{tier.displayName}</span>
                    )}
                  </div>
                </div>
              </TacticalCard>
            </Link>
          );
        })}
      </div>
      {filtered.length > 80 && (
        <p className="text-center text-[11px] text-[#ece8e1]/50">
          Showing first 80. Use filters to narrow.
        </p>
      )}
    </section>
  );
}
