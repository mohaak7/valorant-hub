import type { Metadata } from "next";
import Link from "next/link";
import {
  fetchWeapons,
  fetchContentTiers,
  fetchAllSkins,
} from "@/lib/valorant-api";
import { TacticalCard } from "@/components/TacticalCard";
import { SkinsFilters } from "./SkinsFilters";
import { SkinsGridClient } from "./SkinsGridClient";
import { useLanguage } from "@/lib/lang-context";

export const revalidate = 3600;

type PageSearchParams = {
  weapon?: string;
  tier?: string;
  q?: string;
  sort?: string;
};

type PageProps = {
  searchParams: Promise<PageSearchParams>;
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

  const sort = params.sort ?? "name";
  if (sort === "name") {
    filtered = [...filtered].sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
  } else if (sort === "newest") {
    filtered = [...filtered].reverse();
  } else if (sort === "oldest") {
    // keep API order as-is (assumed chronological)
  }

  const { t } = useLanguage();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.15em] text-[#ece8e1] sm:text-4xl">
            {t.headers.skins}
          </h1>
          <p className="mt-2 text-sm uppercase tracking-widest text-[#ece8e1]/70">
            {/* Simple static description; can be translated later via dictionary if desired */}
            Filter by weapon type &amp; tier
          </p>
        </div>
        <SkinsFilters
          weaponOptions={weaponOptions}
          tierOptions={tierOptions}
          currentWeapon={params.weapon ?? ""}
          currentTier={params.tier ?? ""}
          currentQ={params.q ?? ""}
          currentSort={params.sort ?? "name"}
        />
      </div>

      <p className="text-[11px] uppercase tracking-widest text-[#ece8e1]/50">
        {filtered.length} skin{filtered.length !== 1 ? "s" : ""}
      </p>

      <SkinsGridClient
        skins={filtered.slice(0, 80).map((skin) => {
          const tier = tierMap.get(skin.contentTierUuid);
          const icon =
            skin.displayIcon ||
            skin.chromas?.[0]?.displayIcon ||
            skin.levels?.[0]?.displayIcon;
          return {
            uuid: skin.uuid,
            displayName: skin.displayName,
            weaponName: skin.weaponName,
            imageUrl: icon ?? null,
            tierName: tier?.displayName ?? null,
          };
        })}
      />
      {filtered.length > 80 && (
        <p className="text-center text-[11px] text-[#ece8e1]/50">
          Showing first 80. Use filters to narrow.
        </p>
      )}
    </section>
  );
}
