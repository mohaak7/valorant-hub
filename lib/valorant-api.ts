const API_BASE = "https://valorant-api.com/v1";

type ApiResponse<T> = { status: number; data: T };

export type AgentRole = {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
};

export type AgentAbility = {
  slot: string;
  displayName: string;
  description: string;
  displayIcon: string;
};

export type Agent = {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
  fullPortrait: string;
  background: string;
  backgroundGradientColors: string[];
  role: AgentRole;
  abilities: AgentAbility[];
};

export type ContentTier = {
  uuid: string;
  displayName: string;
  devName: string;
  rank: number;
  displayIcon: string;
};

/** Exact content tier UUID → VP price (Valorant standard pricing). */
const TIER_UUID_TO_VP: Record<string, string> = {
  "12683d76-48d7-2604-28fa-6e836fa18abc": "875 VP",   // Select
  "0cebb8be-46d7-c12a-d306-e9907bfc5a25": "1275 VP",  // Deluxe
  "60bca009-4182-7998-dee7-b8a2558dc369": "1775 VP",   // Premium
  "411e4a55-4e59-7757-41f0-86a53f101bb5": "2475 VP",  // Ultra
  "e046854e-406c-37f4-6607-19a9ba8426fc": "Varies",   // Exclusive
};

/**
 * Returns the VP price label for a skin based on its content tier UUID.
 * Use this for display when you only have the UUID (e.g. in SkinCard).
 */
export function getSkinPriceByTierUuid(
  tierUuid: string | null | undefined
): string {
  if (tierUuid == null || tierUuid === "") return "N/A";
  return TIER_UUID_TO_VP[tierUuid] ?? "N/A";
}

/** Estimated VP by tier (Select = Blue, Deluxe = Green, etc.). Exclusive has no fixed price. */
const TIER_VP: Record<string, string> = {
  Select: "875",
  Deluxe: "1275",
  Premium: "1775",
  Ultra: "2475",
  Exclusive: "Exclusive",
};

/** Returns estimated VP label and tier icon for a skin's content tier. */
export function getSkinPrice(tier: ContentTier | null | undefined): {
  vpLabel: string;
  tierIcon: string | null;
} {
  if (!tier) return { vpLabel: "N/A", tierIcon: null };
  return {
    vpLabel: getSkinPriceByTierUuid(tier.uuid),
    tierIcon: tier.displayIcon ?? null,
  };
}

export type WeaponSkinChroma = {
  uuid: string;
  displayIcon: string | null;
  fullRender: string;
  swatch?: string | null;
};

export type WeaponSkin = {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid: string;
  displayIcon: string | null;
  wallpaper: string | null;
  chromas: WeaponSkinChroma[];
  levels: { uuid: string; displayIcon: string | null }[];
};

export type Weapon = {
  uuid: string;
  displayName: string;
  category: string;
  displayIcon: string;
  skins: WeaponSkin[];
};

export type SkinWithWeapon = WeaponSkin & { weaponName: string; weaponUuid: string };

export type Bundle = {
  uuid: string;
  displayName: string;
  displayNameSubText: string | null;
  description: string;
  displayIcon: string;
  displayIcon2: string;
  verticalPromoImage: string | null;
};

export type Theme = {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
};

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json: ApiResponse<T> = await res.json();
  if (json?.data == null) throw new Error("API returned null data");
  return json.data;
}

export async function fetchAgents(): Promise<Agent[]> {
  try {
    const data = await fetchApi<Agent[]>("/agents?isPlayableCharacter=true");
    const list = Array.isArray(data) ? data : [];
    return (list as (Agent & { isPlayableCharacter?: boolean })[]).filter(
      (a) => a.isPlayableCharacter !== false
    );
  } catch {
    return [];
  }
}

export async function fetchWeapons(): Promise<Weapon[]> {
  try {
    const data = await fetchApi<Weapon[]>("/weapons");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchBundles(): Promise<Bundle[]> {
  try {
    const data = await fetchApi<Bundle[]>("/bundles");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchContentTiers(): Promise<ContentTier[]> {
  try {
    const data = await fetchApi<ContentTier[]>("/contenttiers");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchThemes(): Promise<Theme[]> {
  try {
    const data = await fetchApi<Theme[]>("/themes");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** All skins flattened with weapon name for filtering */
export async function fetchAllSkins(): Promise<SkinWithWeapon[]> {
  try {
    const weapons = await fetchWeapons();
    if (!Array.isArray(weapons)) return [];
    const skins: SkinWithWeapon[] = [];
    for (const w of weapons) {
      const wSkins = w?.skins;
      if (!Array.isArray(wSkins)) continue;
      for (const s of wSkins) {
        if (!s.displayName?.match(/Level \d+/)) {
          skins.push({
            ...s,
            weaponName: w.displayName ?? "",
            weaponUuid: w.uuid ?? "",
          });
        }
      }
    }
    return skins;
  } catch {
    return [];
  }
}

/** Agents for static generation */
export async function getAllAgents(): Promise<Agent[]> {
  return fetchAgents();
}

/** Bundles grouped by displayName (theme) - unique by name */
export function groupBundlesByName(bundles: Bundle[]): Map<string, Bundle[]> {
  const map = new Map<string, Bundle[]>();
  for (const b of bundles) {
    const name = b.displayName;
    if (!map.has(name)) map.set(name, []);
    map.get(name)!.push(b);
  }
  return map;
}

/** Get skin IDs that belong to a bundle by matching theme displayName to bundle displayName */
export function getSkinsInBundle(
  bundleDisplayName: string,
  themes: Theme[],
  allSkins: SkinWithWeapon[]
): SkinWithWeapon[] {
  const themeUuids = new Set(
    themes
      .filter(
        (t) =>
          t.displayName?.toLowerCase() === bundleDisplayName.toLowerCase()
      )
      .map((t) => t.uuid)
  );
  return allSkins.filter((s) => themeUuids.has(s.themeUuid));
}

/** Tier names allowed in Skin Roulette (no "standard" – Select and above only) */
const ROULETTE_TIER_DEV_NAMES = [
  "Select",
  "Deluxe",
  "Premium",
  "Ultra",
  "Exclusive",
];

/** Category sort order for weapon list (rifles/heavy first, sidearms last) */
const WEAPON_CATEGORY_ORDER: Record<string, number> = {
  "EEquippableCategory::Rifle": 0,
  "EEquippableCategory::Heavy": 1,
  "EEquippableCategory::SMG": 2,
  "EEquippableCategory::Shotgun": 3,
  "EEquippableCategory::Sidearm": 4,
  "EEquippableCategory::Melee": 5,
};

export type WeaponForRoulette = {
  uuid: string;
  displayName: string;
  displayIcon: string;
  category: string;
  skins: {
    uuid: string;
    skinName: string;
    imageUrl: string;
    tierName?: string;
  }[];
};

/** Weapons with skins filtered to Select / Deluxe / Premium / Ultra / Exclusive only. Sorted for display. */
export async function fetchWeaponsForRoulette(): Promise<WeaponForRoulette[]> {
  try {
    const [weapons, tiers] = await Promise.all([
      fetchWeapons(),
      fetchContentTiers(),
    ]);
    if (!Array.isArray(weapons) || !Array.isArray(tiers)) return [];
    const allowedTierUuids = new Set(
      tiers
        .filter((t) => t && ROULETTE_TIER_DEV_NAMES.includes(t.devName))
        .map((t) => t.uuid)
    );
    const tierMap = new Map(tiers.map((t) => [t.uuid, t.displayName]));

    const result: WeaponForRoulette[] = [];

    for (const w of weapons) {
      const wSkins = w?.skins;
      if (!Array.isArray(wSkins)) continue;
      const skins = wSkins
      .filter((s) => !s.displayName?.match(/Level \d+/))
      .filter((s) => allowedTierUuids.has(s.contentTierUuid))
      .map((s) => ({
        uuid: s.uuid,
        skinName: s.displayName,
        imageUrl:
          s.chromas?.[0]?.fullRender ??
          s.displayIcon ??
          s.levels?.[0]?.displayIcon ??
          "",
        tierName: tierMap.get(s.contentTierUuid) ?? undefined,
      }))
      .filter((s) => s.imageUrl);

    if (skins.length === 0) continue;

      result.push({
        uuid: w.uuid,
        displayName: w.displayName,
        displayIcon: w.displayIcon,
        category: w.category,
        skins,
      });
    }

    result.sort((a, b) => {
      const orderA = WEAPON_CATEGORY_ORDER[a.category] ?? 99;
      const orderB = WEAPON_CATEGORY_ORDER[b.category] ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.displayName.localeCompare(b.displayName);
    });

    return result;
  } catch {
    return [];
  }
}

/** Skins filtered to Deluxe, Premium, Ultra, and Exclusive tiers only (no Select). Legacy. */
export async function fetchRouletteSkins(): Promise<SkinWithWeapon[]> {
  try {
    const [tiers, allSkins] = await Promise.all([
      fetchContentTiers(),
      fetchAllSkins(),
    ]);
    if (!Array.isArray(tiers) || !Array.isArray(allSkins)) return [];
    const allowedUuids = new Set(
      tiers
        .filter((t) =>
          ["Deluxe", "Premium", "Ultra", "Exclusive"].includes(t.devName)
        )
        .map((t) => t.uuid)
    );
    return allSkins.filter((s) => allowedUuids.has(s.contentTierUuid));
  } catch {
    return [];
  }
}
