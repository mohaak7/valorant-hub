"use client";

import Link from "next/link";
import Image from "next/image";
import { TacticalCard } from "@/components/TacticalCard";

type SkinCardProps = {
  uuid: string;
  displayName: string;
  weaponName: string;
  imageUrl: string | null;
  tierName?: string | null;
  tierIcon?: string | null;
  contentTierUuid?: string | null;
  vpLabel?: string;
};

const TIER_PRICES: Record<string, string> = {
  "12683d76-48d7-2604-28fa-6e836fa18abc": "875",    // Select (Blue)
  "0cebb8be-46d7-c12a-d306-e9907bfc5a25": "1275",   // Deluxe (Green)
  "60bca009-4182-7998-dee7-b8a2558dc369": "1775",   // Premium (Pink)
  "411e4a55-4e59-7757-41f0-86a53f101bb5": "2475",   // Ultra (Yellow)
  "e046854e-406c-37f4-6607-19a9ba8426fc": "Excl.",  // Exclusive (Orange)
};

export function SkinCard({
  uuid,
  displayName,
  weaponName,
  imageUrl,
  tierName,
  contentTierUuid,
  vpLabel,
}: SkinCardProps) {
  const tierUuid = contentTierUuid?.toLowerCase();
  const price = tierUuid ? TIER_PRICES[tierUuid] : null;

  return (
    <Link href={`/skins/${uuid}`}>
      <TacticalCard className="h-full" glitch>
        <div className="relative flex flex-col items-center gap-2">
          <div className="relative aspect-[2/1] w-full border border-[#ece8e1]/20 bg-[#0f1923]">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={displayName}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-contain p-2"
              />
            )}
            {price && (
              <div
                className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded border border-white/10 bg-black/80 px-2 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm"
                aria-label={`Price: ${price} VP`}
              >
                <span className="text-yellow-400">VP</span>
                {price}
              </div>
            )}
          </div>
          <p className="w-full truncate text-center text-xs font-bold uppercase tracking-wider text-[#ece8e1]">
            {displayName}
          </p>
          <div className="flex w-full items-center justify-between gap-2 text-[10px] uppercase tracking-widest text-[#ece8e1]/60">
            <span>{weaponName}</span>
            {tierName && (
              <span className="text-[#ff4655]/90">{tierName}</span>
            )}
          </div>
        </div>
      </TacticalCard>
    </Link>
  );
}
