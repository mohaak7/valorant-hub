import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.baseUrl.replace(/\/$/, "");

  return [
    "",
    "/agents",
    "/skins",
    "/bundles",
    "/crosshairs",
  ].map((path) => ({
    url: `${baseUrl}${path || "/"}`,
    lastModified: new Date(),
  }));
}
