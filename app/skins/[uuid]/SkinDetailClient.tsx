"use client";

import { useState } from "react";
import Image from "next/image";
import { TacticalCard } from "@/components/TacticalCard";
import type { WeaponSkinChroma } from "@/lib/valorant-api";

type SkinDetailClientProps = {
  skin: {
    displayName: string;
    chromas: WeaponSkinChroma[];
    levels: { displayIcon: string | null }[];
  };
};

function getHighResImage(
  chromas: WeaponSkinChroma[],
  levels: { displayIcon: string | null }[],
  selectedChromaIndex: number
): string | null {
  const chroma = chromas[selectedChromaIndex];
  if (chroma?.fullRender) return chroma.fullRender;
  const lastLevel = levels.length > 0 ? levels[levels.length - 1] : null;
  if (lastLevel?.displayIcon) return lastLevel.displayIcon;
  if (chromas[0]?.fullRender) return chromas[0].fullRender;
  return levels[0]?.displayIcon ?? null;
}

export function SkinDetailClient({ skin }: SkinDetailClientProps) {
  const [selectedChromaIndex, setSelectedChromaIndex] = useState(0);
  const chromas = skin.chromas ?? [];
  const levels = skin.levels ?? [];
  const mainImageUrl = getHighResImage(
    chromas,
    levels,
    selectedChromaIndex
  );

  return (
    <div className="space-y-6">
      <TacticalCard glitch={false} className="overflow-hidden">
        <div className="relative aspect-video w-full bg-[#0f1923]">
          {mainImageUrl && (
            <Image
              src={mainImageUrl}
              alt={skin.displayName}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain"
              priority
              unoptimized
            />
          )}
        </div>
      </TacticalCard>

      {chromas.length > 1 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#ece8e1]/80">
            Color / Chroma
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {chromas.map((c, i) => {
              const isSelected = i === selectedChromaIndex;
              const swatchUrl = c.swatch ?? c.displayIcon ?? c.fullRender;
              return (
                <button
                  key={c.uuid}
                  type="button"
                  onClick={() => setSelectedChromaIndex(i)}
                  className={`relative h-12 w-12 shrink-0 overflow-hidden border-2 bg-[#0f1923] transition hover:border-[#ff4655]/80 ${
                    isSelected
                      ? "border-[#ff4655] ring-2 ring-[#ff4655]/50"
                      : "border-[#ece8e1]/20"
                  }`}
                  title={`Chroma ${i + 1}`}
                >
                  {swatchUrl ? (
                    <Image
                      src={swatchUrl}
                      alt=""
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  ) : (
                    <span className="text-[10px] text-[#ece8e1]/50">
                      {i + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
