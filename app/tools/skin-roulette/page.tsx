import type { Metadata } from "next";
import { fetchWeaponsForRoulette } from "@/lib/valorant-api";
import { SkinRouletteClient } from "./roulette-client";

export const metadata: Metadata = {
  title: "Skin Roulette | Pick Weapon → Spin for Random Skin",
  description:
    "Select a weapon, then spin for a random skin. Select / Deluxe / Premium / Ultra / Exclusive tiers only.",
};

export const revalidate = 86400;

export default async function SkinRoulettePage() {
  const weapons = await fetchWeaponsForRoulette();

  return <SkinRouletteClient weapons={weapons} />;
}
