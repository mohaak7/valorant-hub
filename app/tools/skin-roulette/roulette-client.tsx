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

const SELECTION_KEY = "owned-skins";

function readSelected(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SELECTION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id: unknown): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function writeSelected(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    const unique = Array.from(
      new Set(ids.filter((id): id is string => typeof id === "string"))
    );
    window.localStorage.setItem(SELECTION_KEY, JSON.stringify(unique));
  } catch {
    // ignore
  }
}

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mode, setMode] = useState<"all" | "selection">("all");

  const timerRef = useRef<number | null>(null);
  const stopRef = useRef<number | null>(null);

  const allSkins: SkinItem[] = selectedWeapon?.skins ?? [];
  const poolSkins: SkinItem[] =
    mode === "selection"
      ? allSkins.filter((s) => selectedIds.includes(s.uuid))
      : allSkins;
  const canSpin = poolSkins.length >= 1 && !isSpinning;

  useEffect(() => {
    // Load custom pool selection from localStorage and set up cleanup
    setSelectedIds(readSelected());

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (stopRef.current) window.clearTimeout(stopRef.current);
    };
  }, []);

  useEffect(() => {
    if (!selectedWeapon || !poolSkins.length) return;
    setActiveIndex(pickRandomIndex(poolSkins.length));
    setWinnerIndex(null);
  }, [selectedWeapon?.uuid, poolSkins.length, mode]);

  function spin() {
    // Prevent empty spins up front
    if (!selectedWeapon || isSpinning) return;

    if (!poolSkins.length) {
      if (typeof window !== "undefined") {
        window.alert("Please select at least one skin first!");
      }
      return;
    }

    setIsSpinning(true);
    setWinnerIndex(null);

    let i = activeIndex;
    timerRef.current = window.setInterval(() => {
      i = (i + 1 + Math.floor(Math.random() * 2)) % poolSkins.length;
      setActiveIndex(i);
    }, TICK_MS);

    stopRef.current = window.setTimeout(() => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      const win = pickRandomIndex(poolSkins.length);
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

  const safeIndex = poolSkins.length
    ? Math.min(activeIndex, poolSkins.length - 1)
    : 0;
  const active = poolSkins[safeIndex];
  const winner = winnerIndex != null ? poolSkins[winnerIndex] : null;
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
          {allSkins.length === 0 ? (
            <TacticalCard glitch={false} className="border-[#ff4655]/50">
              <p className="text-sm uppercase text-[#ece8e1]/80">
                No skins in Select+ tiers for {selectedWeapon.displayName}.
                Pick another weapon.
              </p>
            </TacticalCard>
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ece8e1]/70">
                    Step 2 — Roulette: {selectedWeapon.displayName} only
                  </p>
                  <div className="flex gap-1 text-[10px] font-bold uppercase tracking-widest">
                    <button
                      type="button"
                      onClick={() => setMode("all")}
                      className={`px-2 py-1 border ${
                        mode === "all"
                          ? "border-[#ff4655] bg-[#ff4655] text-[#0f1923]"
                          : "border-[#ece8e1]/30 bg-[#0f1923] text-[#ece8e1]/80 hover:border-[#ff4655] hover:text-[#ece8e1]"
                      }`}
                    >
                      All Skins
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("selection")}
                      className={`px-2 py-1 border ${
                        mode === "selection"
                          ? "border-[#ff4655] bg-[#ff4655] text-[#0f1923]"
                          : "border-[#ece8e1]/30 bg-[#0f1923] text-[#ece8e1]/80 hover:border-[#ff4655] hover:text-[#ece8e1]"
                      }`}
                    >
                      My Selection
                    </button>
                  </div>
                </div>
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

              {active ? (
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
                          {display?.skinName}
                        </p>
                        <p className="mt-1 text-sm uppercase tracking-widest text-[#ece8e1]/70">
                          {selectedWeapon.displayName}
                          {display?.tierName && ` · ${display.tierName}`}
                        </p>
                      </div>

                      <div className="clip-tactical-inverse relative aspect-video overflow-hidden border border-[#ece8e1]/25 bg-[#0f1923]">
                        {display && (
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
                        )}
                        {display && (
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f1923] to-transparent p-3">
                            <Link
                              href={`/skins/${display.uuid}`}
                              className="pointer-events-auto text-[11px] font-bold uppercase tracking-[0.3em] text-[#ff4655] underline hover:no-underline"
                            >
                              View skin →
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TacticalCard>
              ) : (
                <TacticalCard glitch={false} className="border-[#ff4655]/50">
                  <p className="text-sm uppercase text-[#ece8e1]/80">
                    Select some skins to start spinning!
                  </p>
                </TacticalCard>
              )}

              {/* Step 3: Custom pool selection grid */}
              <div className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ece8e1]/70">
                    Step 3 — Choose skins for pool
                  </p>
                  <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <button
                      type="button"
                      onClick={() => {
                        const ids = allSkins.map((s) => s.uuid);
                        setSelectedIds(ids);
                        writeSelected(ids);
                      }}
                      className="border border-[#ece8e1]/40 bg-[#0f1923] px-2 py-1 text-[#ece8e1]/80 hover:border-[#ff4655] hover:text-[#ece8e1]"
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const remaining = selectedIds.filter(
                          (id) => !allSkins.some((s) => s.uuid === id)
                        );
                        setSelectedIds(remaining);
                        writeSelected(remaining);
                      }}
                      className="border border-[#ece8e1]/40 bg-[#0f1923] px-2 py-1 text-[#ece8e1]/80 hover:border-[#ff4655] hover:text-[#ece8e1]"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {allSkins.map((skin) => {
                    const isSelected = selectedIds.includes(skin.uuid);
                    return (
                      <button
                        key={skin.uuid}
                        type="button"
                        onClick={() => {
                          setSelectedIds((prev) => {
                            const exists = prev.includes(skin.uuid);
                            const next = exists
                              ? prev.filter((id) => id !== skin.uuid)
                              : [...prev, skin.uuid];
                            writeSelected(next);
                            return next;
                          });
                        }}
                        className={`clip-tactical relative flex flex-col items-center gap-1 border-2 bg-[#0f1923] p-2 text-[9px] font-bold uppercase tracking-widest transition ${
                          isSelected
                            ? "border-emerald-400 ring-1 ring-emerald-400/50"
                            : "border-[#ece8e1]/20 hover:border-[#ece8e1]/60"
                        }`}
                      >
                        <div className="relative h-10 w-full border border-[#ece8e1]/20 bg-[#0f1923]">
                          <Image
                            src={skin.imageUrl}
                            alt={skin.skinName}
                            fill
                            sizes="80px"
                            className="object-contain p-1"
                            unoptimized
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-emerald-400/10" />
                          )}
                        </div>
                        <span className="line-clamp-2 text-center text-[9px] text-[#ece8e1]">
                          {skin.skinName}
                        </span>
                        {skin.tierName && (
                          <span className="text-[8px] uppercase text-emerald-300">
                            {skin.tierName}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
