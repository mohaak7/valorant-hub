import type { Metadata } from "next";
import { fetchAgents } from "@/lib/valorant-api";
import { AgentRouletteClient } from "./roulette-client";

export const metadata: Metadata = {
  title: "Agent Roulette | Random Valorant Agent Picker",
  description:
    "Spin the Agent Roulette to pick a random Valorant agent. Slot-machine animation, tactical UI.",
};

export const revalidate = 86400;

export default async function AgentRoulettePage() {
  const agents = await fetchAgents();

  // Basic sanity: keep playable agents with portraits.
  const usable = agents.filter((a) => a.fullPortrait && a.role?.displayName);

  return <AgentRouletteClient agents={usable} />;
}

