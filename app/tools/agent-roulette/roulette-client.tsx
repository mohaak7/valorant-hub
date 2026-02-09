"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { TacticalCard } from "@/components/TacticalCard";

type Agent = {
  uuid: string;
  displayName: string;
  fullPortrait: string;
  backgroundGradientColors?: string[];
  role?: { displayName: string; displayIcon?: string };
};

type AgentRouletteClientProps = {
  agents: Agent[];
};

function pickRandomIndex(max: number) {
  return Math.floor(Math.random() * max);
}

export function AgentRouletteClient({ agents }: AgentRouletteClientProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    agents.length ? pickRandomIndex(agents.length) : 0
  );
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);
  const stopRef = useRef<number | null>(null);

  const winner = winnerIndex != null ? agents[winnerIndex] : null;

  const bg = useMemo(() => {
    const agent = winner ?? agents[activeIndex];
    const c = agent?.backgroundGradientColors?.[0]?.slice(0, 6) ?? "0f1923";
    return `linear-gradient(180deg, #${c}55 0%, #0f1923 55%)`;
  }, [agents, activeIndex, winner]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (stopRef.current) window.clearTimeout(stopRef.current);
    };
  }, []);

  function spin() {
    if (agents.length < 2) return;
    if (isSpinning) return;

    setIsSpinning(true);
    setWinnerIndex(null);

    // Rapid cycling like a slot machine.
    let i = activeIndex;
    timerRef.current = window.setInterval(() => {
      i = (i + 1 + Math.floor(Math.random() * 3)) % agents.length;
      setActiveIndex(i);
    }, 70);

    // Stop after ~2.6s and pick a winner.
    stopRef.current = window.setTimeout(() => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      const win = pickRandomIndex(agents.length);
      setActiveIndex(win);
      setWinnerIndex(win);
      setIsSpinning(false);
    }, 2600);
  }

  if (!agents.length) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-bold uppercase tracking-[0.15em] text-[#ece8e1]">
          Agent Roulette
        </h1>
        <p className="text-sm uppercase tracking-widest text-[#ece8e1]/70">
          No agents available.
        </p>
      </section>
    );
  }

  const active = agents[activeIndex];

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="glitch-hover text-3xl font-bold uppercase tracking-[0.15em] text-[#ece8e1] sm:text-4xl">
            <span className="glitch-text">Agent Roulette</span>
          </h1>
          <p className="text-sm uppercase tracking-widest text-[#ece8e1]/70">
            Spin to pick your next main.
          </p>
        </div>
        <button
          type="button"
          onClick={spin}
          disabled={isSpinning}
          className="glitch-hover clip-tactical border-2 border-[#ff4655] bg-[#ff4655] px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-[#0f1923] transition hover:bg-[#ece8e1] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="glitch-text">{isSpinning ? "Spinning..." : "Pick agent"}</span>
        </button>
      </div>

      <TacticalCard
        glitch={!winner}
        className="overflow-hidden border-2 border-[#ece8e1]/20"
      >
        <div className="absolute inset-0" style={{ background: bg }} />
        <div className="relative grid gap-6 p-4 lg:grid-cols-[280px,1fr] lg:p-6">
          {/* Slot window */}
          <div className="clip-tactical-inverse border border-[#ece8e1]/25 bg-[#0f1923] p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ece8e1]/70">
              Slot
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-20 w-20 border-2 border-[#ff4655] bg-[#0f1923]">
                <Image
                  src={active.fullPortrait}
                  alt={active.displayName}
                  fill
                  sizes="80px"
                  className={`object-cover object-top transition ${
                    isSpinning ? "blur-[1px] contrast-125" : ""
                  }`}
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold uppercase tracking-widest text-[#ece8e1]">
                  {active.displayName}
                </p>
                <p className="text-[11px] uppercase tracking-widest text-[#ff4655]">
                  {active.role?.displayName ?? "—"}
                </p>
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-[#ece8e1]/10">
              <div
                className={`h-1 bg-[#ff4655] transition-all ${
                  isSpinning ? "w-3/4" : winner ? "w-full" : "w-1/4"
                }`}
              />
            </div>
          </div>

          {/* Winner panel */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ece8e1]/70">
              Result
            </p>
            <div className="clip-tactical border-2 border-[#ff4655]/60 bg-[#0f1923] p-4">
              <p className="glitch-hover text-xs font-bold uppercase tracking-[0.25em] text-[#ff4655]">
                <span className="glitch-text">
                  {winner ? "Winner locked" : isSpinning ? "Cycling..." : "Ready"}
                </span>
              </p>
              <p className="mt-2 text-2xl font-bold uppercase tracking-widest text-[#ece8e1] sm:text-3xl">
                {(winner ?? active).displayName}
              </p>
              <p className="mt-1 text-sm uppercase tracking-widest text-[#ece8e1]/70">
                Role: {(winner ?? active).role?.displayName ?? "—"}
              </p>
            </div>

            <div className="clip-tactical-inverse relative aspect-[16/9] overflow-hidden border border-[#ece8e1]/25 bg-[#0f1923]">
              <Image
                src={(winner ?? active).fullPortrait}
                alt={(winner ?? active).displayName}
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className={`object-contain object-bottom transition ${
                  isSpinning ? "opacity-70" : "opacity-100"
                }`}
                unoptimized
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f1923] to-transparent p-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ece8e1]/70">
                  Tip: click again to re-roll.
                </p>
              </div>
            </div>
          </div>
        </div>
      </TacticalCard>
    </section>
  );
}

