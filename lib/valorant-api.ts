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
  return json.data;
}

export async function fetchAgents(): Promise<Agent[]> {
  const data = await fetchApi<Agent[]>("/agents?isPlayableCharacter=true");
  return (data as (Agent & { isPlayableCharacter?: boolean })[]).filter(
    (a) => a.isPlayableCharacter !== false
  );
}

export async function fetchWeapons(): Promise<Weapon[]> {
  return fetchApi<Weapon[]>("/weapons");
}

export async function fetchBundles(): Promise<Bundle[]> {
  return fetchApi<Bundle[]>("/bundles");
}

export async function fetchContentTiers(): Promise<ContentTier[]> {
  return fetchApi<ContentTier[]>("/contenttiers");
}

export async function fetchThemes(): Promise<Theme[]> {
  return fetchApi<Theme[]>("/themes");
}

/** All skins flattened with weapon name for filtering */
export async function fetchAllSkins(): Promise<SkinWithWeapon[]> {
  const weapons = await fetchWeapons();
  const skins: SkinWithWeapon[] = [];
  for (const w of weapons) {
    for (const s of w.skins) {
      if (!s.displayName?.match(/Level \d+/)) {
        skins.push({
          ...s,
          weaponName: w.displayName,
          weaponUuid: w.uuid,
        });
      }
    }
  }
  return skins;
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
  const [weapons, tiers] = await Promise.all([
    fetchWeapons(),
    fetchContentTiers(),
  ]);
  const allowedTierUuids = new Set(
    tiers
      .filter((t) => ROULETTE_TIER_DEV_NAMES.includes(t.devName))
      .map((t) => t.uuid)
  );
  const tierMap = new Map(tiers.map((t) => [t.uuid, t.displayName]));

  const result: WeaponForRoulette[] = [];

  for (const w of weapons) {
    const skins = w.skins
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
}

/** Skins filtered to Deluxe, Premium, Ultra, and Exclusive tiers only (no Select). Legacy. */
export async function fetchRouletteSkins(): Promise<SkinWithWeapon[]> {
  const [tiers, allSkins] = await Promise.all([
    fetchContentTiers(),
    fetchAllSkins(),
  ]);
  const allowedUuids = new Set(
    tiers
      .filter((t) =>
        ["Deluxe", "Premium", "Ultra", "Exclusive"].includes(t.devName)
      )
      .map((t) => t.uuid)
  );
  return allSkins.filter((s) => allowedUuids.has(s.contentTierUuid));
}
