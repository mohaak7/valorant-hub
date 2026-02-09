"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TacticalCard } from "@/components/TacticalCard";
import type { WeaponForRoulette } from "@/lib/valorant-api";

type SkinItem = {
  uuid: string;
  skinName: string;
  imageUrl: string;
  tierName?: string;
};

type SkinRouletteClientProps = {
  weapons: WeaponForRoulette[];
};

function pickRandomIndex(max: number) {
  return Math.floor(Math.random() * max);
}

const SPIN_DURATION_MS = 3000;
const TICK_MS = 70;

export function SkinRouletteClient({ weapons }: SkinRouletteClientProps) {
  const [selectedWeapon, setSelectedWeapon] =
    useState<WeaponForRoulette | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);
  const stopRef = useRef<number | null>(null);

  const skins: SkinItem[] = selectedWeapon?.skins ?? [];
  const canSpin = skins.length >= 1 && !isSpinning;

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (stopRef.current) window.clearTimeout(stopRef.current);
    };
  }, []);

  useEffect(() => {
    if (!selectedWeapon || !skins.length) return;
    setActiveIndex(pickRandomIndex(skins.length));
    setWinnerIndex(null);
  }, [selectedWeapon?.uuid, skins.length]);

  function spin() {
    if (!selectedWeapon || skins.length < 1 || isSpinning) return;

    setIsSpinning(true);
    setWinnerIndex(null);

    let i = activeIndex;
    timerRef.current = window.setInterval(() => {
      i = (i + 1 + Math.floor(Math.random() * 2)) % skins.length;
      setActiveIndex(i);
    }, TICK_MS);

    stopRef.current = window.setTimeout(() => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      const win = pickRandomIndex(skins.length);
      setActiveIndex(win);
      setWinnerIndex(win);
      setIsSpinning(false);
    }, SPIN_DURATION_MS);
  }

  if (!weapons.length) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-bold uppercase tracking-[0.15em] text-[#ece8e1]">
          Skin Roulette
        </h1>
        <p className="text-sm uppercase tracking-widest text-[#ece8e1]/70">
          No weapons with Select+ skins available.
        </p>
      </section>
    );
  }

  const safeIndex = skins.length
    ? Math.min(activeIndex, skins.length - 1)
    : 0;
  const active = skins[safeIndex];
  const winner = winnerIndex != null ? skins[winnerIndex] : null;
  const display = winner ?? active;

  return (
    <section className="space-y-8">
      <div>
        <h1 className="glitch-hover text-3xl font-bold uppercase tracking-[0.15em] text-[#ece8e1] sm:text-4xl">
          <span className="glitch-text">Skin Roulette</span>
        </h1>
        <p className="mt-2 text-sm uppercase tracking-widest text-[#ece8e1]/70">
          Select weapon → spin for a random skin (Select / Deluxe / Premium /
          Ultra / Exclusive)
        </p>
      </div>

      {/* Step 1: Weapon selector – inventory grid */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ece8e1]/70">
          Step 1 — Select weapon
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {weapons.map((w) => {
            const isSelected = selectedWeapon?.uuid === w.uuid;
            return (
              <button
                key={w.uuid}
                type="button"
                onClick={() => setSelectedWeapon(w)}
                className={`clip-tactical relative flex flex-col items-center gap-2 border-2 bg-[#0f1923] p-3 transition ${
                  isSelected
                    ? "border-[#ff4655] ring-2 ring-[#ff4655]/50"
                    : "border-[#ece8e1]/20 hover:border-[#ece8e1]/50"
                }`}
              >
                <div className="relative h-14 w-14 shrink-0 border border-[#ece8e1]/20 bg-[#0f1923]">
                  <Image
                    src={w.displayIcon}
                    alt={w.displayName}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
                <span className="w-full truncate text-center text-[10px] font-bold uppercase tracking-wider text-[#ece8e1]">
                  {w.displayName}
                </span>
                <span className="text-[9px] uppercase text-[#ece8e1]/50">
                  {w.skins.length} skin{w.skins.length !== 1 ? "s" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Roulette (only when weapon selected) */}
      {selectedWeapon && (
        <>
          {skins.length === 0 ? (
            <TacticalCard glitch={false} className="border-[#ff4655]/50">
              <p className="text-sm uppercase text-[#ece8e1]/80">
                No skins in Select+ tiers for {selectedWeapon.displayName}.
                Pick another weapon.
              </p>
            </TacticalCard>
          ) : (
            <>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ece8e1]/70">
                  Step 2 — Roulette: {selectedWeapon.displayName} only
                </p>
                <button
                  type="button"
                  onClick={spin}
                  disabled={!canSpin}
                  className="glitch-hover clip-tactical border-2 border-[#ff4655] bg-[#ff4655] px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-[#0f1923] transition hover:bg-[#ece8e1] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="glitch-text">
                    {isSpinning ? "Spinning..." : "Spin"}
                  </span>
                </button>
              </div>

              <TacticalCard
                glitch={!winner}
                className="overflow-hidden border-2 border-[#ece8e1]/20"
              >
                <div className="absolute inset-0 bg-[#0f1923]" />
                <div className="relative grid gap-6 p-4 lg:grid-cols-[280px,1fr] lg:p-6">
                  <div className="clip-tactical-inverse border border-[#ece8e1]/25 bg-[#0f1923] p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ece8e1]/70">
                      Slot
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="relative h-20 w-20 shrink-0 border-2 border-[#ff4655] bg-[#0f1923]">
                        <Image
                          src={active.imageUrl}
                          alt={active.skinName}
                          fill
                          sizes="80px"
                          className={`object-contain p-1 transition ${
                            isSpinning ? "blur-[1px] contrast-125" : ""
                          }`}
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold uppercase tracking-widest text-[#ece8e1]">
                          {active.skinName}
                        </p>
                        <p className="text-[11px] uppercase tracking-widest text-[#ff4655]">
                          {selectedWeapon.displayName}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 h-1 w-full bg-[#ece8e1]/10">
                      <div
                        className={`h-1 bg-[#ff4655] transition-all duration-300 ${
                          isSpinning ? "w-3/4" : winner ? "w-full" : "w-1/4"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ece8e1]/70">
                      Result
                    </p>
                    <div className="clip-tactical border-2 border-[#ff4655]/60 bg-[#0f1923] p-4">
                      <p className="glitch-hover text-xs font-bold uppercase tracking-[0.25em] text-[#ff4655]">
                        <span className="glitch-text">
                          {winner
                            ? "Winner locked"
                            : isSpinning
                              ? "Cycling..."
                              : "Ready"}
                        </span>
                      </p>
                      <p className="mt-2 text-2xl font-bold uppercase tracking-widest text-[#ece8e1] sm:text-3xl">
                        {display.skinName}
                      </p>
                      <p className="mt-1 text-sm uppercase tracking-widest text-[#ece8e1]/70">
                        {selectedWeapon.displayName}
                        {display.tierName && ` · ${display.tierName}`}
                      </p>
                    </div>

                    <div className="clip-tactical-inverse relative aspect-video overflow-hidden border border-[#ece8e1]/25 bg-[#0f1923]">
                      <Image
                        src={display.imageUrl}
                        alt={display.skinName}
                        fill
                        sizes="(max-width: 1024px) 100vw, 700px"
                        className={`object-contain transition ${
                          isSpinning ? "opacity-70" : "opacity-100"
                        }`}
                        unoptimized
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f1923] to-transparent p-3">
                        <Link
                          href={`/skins/${display.uuid}`}
                          className="pointer-events-auto text-[11px] font-bold uppercase tracking-[0.3em] text-[#ff4655] underline hover:no-underline"
                        >
                          View skin →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </TacticalCard>
            </>
          )}
        </>
      )}
    </section>
  );
}
