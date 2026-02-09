import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchAgents } from "@/lib/valorant-api";
import { TacticalCard } from "@/components/TacticalCard";

type PageProps = { params: Promise<{ uuid: string }> };

export async function generateStaticParams() {
  const agents = await fetchAgents();
  return agents.map((a) => ({ uuid: a.uuid }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { uuid } = await params;
  const agents = await fetchAgents();
  const agent = agents.find((a) => a.uuid === uuid);
  if (!agent)
    return { title: "Agent not found" };
  return {
    title: `${agent.displayName} | Role & Abilities`,
    description: agent.description,
  };
}

export const revalidate = 86400;

export default async function AgentPage({ params }: PageProps) {
  const { uuid } = await params;
  const agents = await fetchAgents();
  const agent = agents.find((a) => a.uuid === uuid);

  if (!agent) {
    return (
      <section>
        <h1 className="text-2xl font-bold uppercase text-[#ece8e1]">
          Agent not found
        </h1>
        <Link
          href="/agents"
          className="mt-4 inline-block border-2 border-[#ff4655] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#ff4655]"
        >
          ← All agents
        </Link>
      </section>
    );
  }

  const bgGradient = agent.backgroundGradientColors?.length
    ? `linear-gradient(180deg, #${agent.backgroundGradientColors[0]?.slice(0, 6)} 0%, #0f1923 50%)`
    : "#0f1923";

  return (
    <section
      className="relative overflow-hidden border-2 border-[#ece8e1]/20"
      style={{ background: bgGradient }}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
        <div className="relative min-h-[60vh] lg:min-h-[80vh]">
          <Image
            src={agent.fullPortrait}
            alt={agent.displayName}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-contain object-bottom"
            priority
          />
        </div>
        <div className="flex flex-col gap-6 p-6 lg:py-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ff4655]">
              {agent.role?.displayName}
            </p>
            <h1 className="mt-1 text-3xl font-bold uppercase tracking-widest text-[#ece8e1]">
              {agent.displayName}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#ece8e1]/90">
              {agent.description}
            </p>
          </div>
          <TacticalCard className="border-[#ff4655]/30" glitch={false}>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#ece8e1]/80">
              Abilities
            </h2>
            <ul className="mt-3 space-y-3">
              {agent.abilities.map((ab) => (
                <li key={ab.slot} className="flex gap-3">
                  {ab.displayIcon && (
                    <div className="h-10 w-10 shrink-0 border border-[#ece8e1]/30 bg-[#0f1923]">
                      <Image
                        src={ab.displayIcon}
                        alt=""
                        width={40}
                        height={40}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold uppercase text-[#ece8e1]">
                      {ab.displayName}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-[#ece8e1]/70">
                      {ab.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </TacticalCard>
          <Link
            href="/agents"
            className="inline-block w-full border-2 border-[#ff4655] py-2 text-center text-xs font-bold uppercase tracking-widest text-[#ff4655] transition hover:bg-[#ff4655] hover:text-[#0f1923]"
          >
            ← All agents
          </Link>
        </div>
      </div>
    </section>
  );
}
