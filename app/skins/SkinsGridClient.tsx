"use client";

import { SkinCard } from "@/components/SkinCard";

type SkinForClient = {
  uuid: string;
  displayName: string;
  weaponName: string;
  imageUrl: string | null;
  tierName?: string | null;
};

type SkinsGridClientProps = {
  skins: SkinForClient[];
};

export function SkinsGridClient({ skins }: SkinsGridClientProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {skins.map((skin) => (
        <SkinCard
          key={skin.uuid}
          uuid={skin.uuid}
          displayName={skin.displayName}
          weaponName={skin.weaponName}
          imageUrl={skin.imageUrl}
          tierName={skin.tierName ?? undefined}
        />
      ))}
    </div>
  );
}

