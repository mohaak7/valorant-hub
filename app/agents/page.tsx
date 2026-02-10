import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchAgents } from "@/lib/valorant-api";
import { TacticalCard } from "@/components/TacticalCard";

export const metadata: Metadata = {
  title: "Valorant Agents | Roles & Abilities",
  description:
    "All Valorant agents: portraits, roles, and abilities. Initiator, Duelist, Sentinel, Controller.",
};

export const revalidate = 3600;

export default async function AgentsPage() {
  const agents = await fetchAgents();

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-[0.15em] text-[#ece8e1] sm:text-4xl">
          Agents
        </h1>
        <p className="mt-2 text-sm uppercase tracking-widest text-[#ece8e1]/70">
          Portraits, roles &amp; abilities
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agents.map((agent) => {
          const bgColor =
            agent.backgroundGradientColors?.[0]?.slice(0, 6) || "0f1923";
          return (
            <Link key={agent.uuid} href={`/agents/${agent.uuid}`}>
              <TacticalCard
                className="group h-full overflow-hidden border-[#ece8e1]/20"
                glitch
              >
                <div
                  className="absolute inset-0 opacity-30 transition group-hover:opacity-50"
                  style={{
                    background: `linear-gradient(180deg, #${bgColor}88 0%, #0f1923 70%)`,
                  }}
                />
                <div className="relative flex flex-col">
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={agent.fullPortrait}
                      alt={agent.displayName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top transition group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0f1923] to-transparent p-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#ff4655]">
                        {agent.role?.displayName}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <h2 className="glitch-text text-sm font-bold uppercase tracking-widest">
                      {agent.displayName}
                    </h2>
                    {agent.role?.displayIcon && (
                      <Image
                        src={agent.role.displayIcon}
                        alt=""
                        width={20}
                        height={20}
                        className="opacity-80"
                      />
                    )}
                  </div>
                  <div className="mt-1 flex gap-1">
                    {agent.abilities.slice(0, 4).map((ab) => (
                      <div
                        key={ab.slot}
                        className="relative h-7 w-7 border border-[#ece8e1]/30 bg-[#0f1923]"
                      >
                        {ab.displayIcon && (
                          <Image
                            src={ab.displayIcon}
                            alt={ab.displayName}
                            fill
                            className="object-contain p-0.5"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TacticalCard>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
