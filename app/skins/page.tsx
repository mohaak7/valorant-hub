import type { Metadata } from "next";
import Link from "next/link";
import {
  fetchWeapons,
  fetchContentTiers,
  fetchAllSkins,
  getSkinPrice,
} from "@/lib/valorant-api";
import { TacticalCard } from "@/components/TacticalCard";
import { SkinsFilters } from "./SkinsFilters";
import { SkinsGridClient } from "./SkinsGridClient";
import { SkinsPageHeader } from "./SkinsPageHeader";

export const revalidate = 3600;

function getSkinValue(contentTierUuid: string | null | undefined): number {
  const tierValues: Record<string, number> = {
    "12683d76-48d7-2604-28fa-6e836fa18abc": 875,   // Select
    "0cebb8be-46d7-c12a-d306-e9907bfc5a25": 1275,  // Deluxe
    "60bca009-4182-7998-dee7-b8a2558dc369": 1775,  // Premium
    "411e4a55-4e59-7757-41f0-86a53f101bb5": 2475,  // Ultra
    "e046854e-406c-37f4-6607-19a9ba8426fc": 5000,  // Exclusive (Top tier)
  };
  const key = (contentTierUuid ?? "").toLowerCase();
  return tierValues[key] ?? 0;
}

type PageSearchParams = {
  weapon?: string;
  tier?: string;
  q?: string;
  sort?: string;
  dir?: string;
};

type PageProps = {
  searchParams: Promise<PageSearchParams>;
};

export default async function SkinsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  let weapons: Awaited<ReturnType<typeof fetchWeapons>> = [];
  let tiers: Awaited<ReturnType<typeof fetchContentTiers>> = [];
  let allSkins: Awaited<ReturnType<typeof fetchAllSkins>> = [];
  try {
    const [w, t, s] = await Promise.all([
      fetchWeapons(),
      fetchContentTiers(),
      fetchAllSkins(),
    ]);
    weapons = Array.isArray(w) ? w : [];
    tiers = Array.isArray(t) ? t : [];
    allSkins = Array.isArray(s) ? s : [];
  } catch {
    weapons = [];
    tiers = [];
    allSkins = [];
  }

  const weaponOptions = (weapons ?? [])
    .filter((w) => w?.skins?.length > 0)
    .map((w) => w.displayName)
    .sort((a, b) => a.localeCompare(b));

  const tierOptions = (tiers ?? []).sort((a, b) => a.rank - b.rank);
  const tierMap = new Map((tiers ?? []).map((t) => [t.uuid, t]));

  let filtered = allSkins ?? [];
  // Global filter: never show default weapons or randomizers
  const EXCLUSIVE_TIER_UUID = "e046854e-406c-37f4-6607-19a9ba8426fc";
  filtered = filtered.filter((s) => {
    const name = (s.displayName ?? "").trim();
    if (name === "Random Favorite Skin") return false;
    if (name.toLowerCase().startsWith("standard")) return false;
    const theme = (s.themeUuid ?? "").trim().toLowerCase();
    if (!theme || theme === "standard") return false;
    return true;
  });
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

  const sort = params.sort ?? "name";
  const direction = params.dir === "desc" ? "desc" : "asc";

  if (sort === "name") {
    filtered = [...filtered].sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
  } else if (sort === "newest") {
    // desc = newest first, asc = oldest first
    filtered =
      direction === "desc"
        ? [...filtered].reverse()
        : [...filtered];
  } else if (sort === "price") {
    // Only fixed-price store tiers: Select, Deluxe, Premium, Ultra (exclude Exclusive + Battlepass/free)
    filtered = filtered.filter((s) => {
      const val = getSkinValue(s.contentTierUuid);
      if (val === 0) return false;
      const tier = (s.contentTierUuid ?? "").toLowerCase();
      if (tier === EXCLUSIVE_TIER_UUID.toLowerCase()) return false;
      return true;
    });
    filtered = [...filtered].sort((a, b) => {
      const valA = getSkinValue(a.contentTierUuid);
      const valB = getSkinValue(b.contentTierUuid);
      return direction === "asc" ? valA - valB : valB - valA;
    });
  }

  const skinList = (filtered ?? []).slice(0, 80).map((skin) => {
    const tier = tierMap.get(skin.contentTierUuid);
    const { vpLabel, tierIcon } = getSkinPrice(tier ?? null);
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
      tierIcon: tierIcon ?? null,
      contentTierUuid: skin.contentTierUuid ?? null,
      vpLabel,
    };
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SkinsPageHeader />
        <SkinsFilters
          weaponOptions={weaponOptions}
          tierOptions={tierOptions}
          currentWeapon={params.weapon ?? ""}
          currentTier={params.tier ?? ""}
          currentQ={params.q ?? ""}
          currentSort={params.sort ?? "name"}
          currentDir={params.dir === "desc" ? "desc" : "asc"}
        />
      </div>

      <p className="text-[11px] uppercase tracking-widest text-[#ece8e1]/50">
        {filtered.length} skin{filtered.length !== 1 ? "s" : ""}
      </p>

      <SkinsGridClient skins={skinList} />
      {(filtered?.length ?? 0) > 80 && (
        <p className="text-center text-[11px] text-[#ece8e1]/50">
          Showing first 80. Use filters to narrow.
        </p>
      )}
    </section>
  );
}
