import type { MetadataRoute } from "next";
import { fetchAllSkins, fetchAgents } from "@/lib/valorant-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.valoskinsdb.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/agents`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/skins`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/bundles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/crosshairs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/tools/skin-roulette`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/agent-roulette`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const [skins, agents] = await Promise.all([
    fetchAllSkins(),
    fetchAgents(),
  ]);

  const skinRoutes: MetadataRoute.Sitemap = skins.map((skin) => ({
    url: `${baseUrl}/skins/${skin.uuid}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const agentRoutes: MetadataRoute.Sitemap = agents.map((agent) => ({
    url: `${baseUrl}/agents/${agent.uuid}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...skinRoutes, ...agentRoutes];
}
