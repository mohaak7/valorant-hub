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

const ROLE_OPTIONS = ["All", "Duelist", "Initiator", "Sentinel", "Controller"] as const;
type RoleFilter = (typeof ROLE_OPTIONS)[number];

function pickRandomIndex(max: number) {
  return Math.floor(Math.random() * max);
}

/** Strict filter: only agents whose role.displayName exactly matches the selected role. */
function filterAgentsByRole(agents: Agent[], role: RoleFilter): Agent[] {
  if (role === "All") return agents;
  return agents.filter((a) => a.role?.displayName === role);
}

export function AgentRouletteClient({ agents }: AgentRouletteClientProps) {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
  const filteredAgents = useMemo(
    () => filterAgentsByRole(agents, roleFilter),
    [agents, roleFilter]
  );

  const [isSpinning, setIsSpinning] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);
  const stopRef = useRef<number | null>(null);

  // When role filter or filtered list changes, clamp index and clear winner
  useEffect(() => {
    const n = filteredAgents.length;
    if (n === 0) return;
    setActiveIndex((prev) => (prev < n ? prev : pickRandomIndex(n)));
    setWinnerIndex(null);
  }, [roleFilter, filteredAgents.length]);

  const winner = winnerIndex != null && winnerIndex < filteredAgents.length
    ? filteredAgents[winnerIndex]
    : null;
  const activeAgent = filteredAgents[activeIndex];

  const bg = useMemo(() => {
    const agent = winner ?? activeAgent;
    const c = agent?.backgroundGradientColors?.[0]?.slice(0, 6) ?? "0f1923";
    return `linear-gradient(180deg, #${c}55 0%, #0f1923 55%)`;
  }, [filteredAgents, activeIndex, winner]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (stopRef.current) window.clearTimeout(stopRef.current);
    };
  }, []);

  function spin() {
    if (filteredAgents.length < 2) return;
    if (isSpinning) return;

    setIsSpinning(true);
    setWinnerIndex(null);

    const n = filteredAgents.length;
    let i = activeIndex;
    timerRef.current = window.setInterval(() => {
      i = (i + 1 + Math.floor(Math.random() * 3)) % n;
      setActiveIndex(i);
    }, 70);

    stopRef.current = window.setTimeout(() => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      const win = pickRandomIndex(n);
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

  const active = activeAgent;
  const hasFilteredAgents = filteredAgents.length > 0;

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
          disabled={isSpinning || !hasFilteredAgents}
          className="glitch-hover clip-tactical border-2 border-[#ff4655] bg-[#ff4655] px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-[#0f1923] transition hover:bg-[#ece8e1] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="glitch-text">{isSpinning ? "Spinning..." : "Pick agent"}</span>
        </button>
      </div>

      {/* Role filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ece8e1]/70">
          Role:
        </span>
        {ROLE_OPTIONS.map((role) => {
          const isActive = roleFilter === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={`clip-tactical px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition ${
                isActive
                  ? "border-2 border-[#ff4655] bg-[#ff4655] text-white"
                  : "border-2 border-[#ff4655] bg-transparent text-white hover:bg-[#ff4655]/20"
              }`}
            >
              {role}
            </button>
          );
        })}
      </div>

      {!hasFilteredAgents ? (
        <div className="clip-tactical border-2 border-[#ece8e1]/20 bg-[#0f1923]/80 p-6 text-center">
          <p className="text-sm uppercase tracking-widest text-[#ece8e1]/70">
            No agents in this role. Try another filter.
          </p>
        </div>
      ) : (
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
      )}
    </section>
  );
}

