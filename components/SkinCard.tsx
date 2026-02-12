"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TacticalCard } from "@/components/TacticalCard";

type SkinCardProps = {
  uuid: string;
  displayName: string;
  weaponName: string;
  imageUrl: string | null;
  tierName?: string | null;
};

const INVENTORY_KEY = "my-inventory";
const LEGACY_KEY = "ownedSkins";

function readIsOwned(uuid: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const currentRaw = window.localStorage.getItem(INVENTORY_KEY);
    const legacyRaw = window.localStorage.getItem(LEGACY_KEY);

    const ids = new Set<string>();

    if (currentRaw) {
      const parsed = JSON.parse(currentRaw);
      if (Array.isArray(parsed)) {
        parsed.forEach((id) => {
          if (typeof id === "string") ids.add(id);
        });
      }
    }

    if (legacyRaw) {
      const parsedLegacy = JSON.parse(legacyRaw);
      if (Array.isArray(parsedLegacy)) {
        parsedLegacy.forEach((id) => {
          if (typeof id === "string") ids.add(id);
        });
      }
    }

    return ids.has(uuid);
  } catch {
    return false;
  }
}

function writeOwned(uuid: string, nextOwned: boolean) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(INVENTORY_KEY);
    let list: string[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        list = parsed.filter((id): id is string => typeof id === "string");
      }
    }
    const set = new Set(list);
    if (nextOwned) set.add(uuid);
    else set.delete(uuid);
    window.localStorage.setItem(INVENTORY_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

export function SkinCard({
  uuid,
  displayName,
  weaponName,
  imageUrl,
  tierName,
}: SkinCardProps) {
  const [isOwned, setIsOwned] = useState(false);

  useEffect(() => {
    setIsOwned(readIsOwned(uuid));
  }, [uuid]);

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsOwned((prev) => {
      const next = !prev;
      writeOwned(uuid, next);
      return next;
    });
  }

  return (
    <Link href={`/skins/${uuid}`}>
      <TacticalCard className="h-full" glitch>
        <div className="relative flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={
              isOwned ? "Remove from my inventory" : "Add to my inventory"
            }
            className={`absolute right-2 top-2 flex items-center justify-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest transition ${
              isOwned
                ? "border-[#ff4655] bg-[#ff4655]/20 text-[#ff4655]"
                : "border-[#ece8e1]/30 bg-[#0f1923]/80 text-[#ece8e1]/70 hover:border-[#ff4655] hover:text-[#ff4655]"
            }`}
          >
            <span
              className={`text-[12px] leading-none ${
                isOwned ? "text-[#ff4655]" : "text-[#ece8e1]/80"
              }`}
            >
              {isOwned ? "♥" : "♡"}
            </span>
          </button>
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

