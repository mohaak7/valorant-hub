import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.valorant-api.com" },
      { protocol: "https", hostname: "static.valorant-api.com" },
      { protocol: "https", hostname: "media.valorant-api.com" },
    ],
  },
};

export default withMDX(nextConfig);

