import skinsData from "@/data/skins.json";

export type PricePoint = {
  date: string;
  vp: number;
};

export type Skin = {
  slug: string;
  name: string;
  weapon: string;
  imageUrl: string;
  estimatedVpPrice: number;
  priceHistory: PricePoint[];
};

export function getAllSkins(): Skin[] {
  return skinsData as Skin[];
}

export function getTopSkins(limit = 6): Skin[] {
  return getAllSkins().slice(0, limit);
}

export function getSkinBySlug(slug: string): Skin | undefined {
  return getAllSkins().find((skin) => skin.slug === slug);
}

