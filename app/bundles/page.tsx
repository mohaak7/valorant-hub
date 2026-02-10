import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchBundles, groupBundlesByName } from "@/lib/valorant-api";
import { TacticalCard } from "@/components/TacticalCard";

export const metadata: Metadata = {
  title: "Valorant Bundles | Skin Bundles by Theme",
  description:
    "Browse Valorant skin bundles. Bundle cover images and themes from the official store.",
};

export const revalidate = 3600;

export default async function BundlesPage() {
  const bundles = await fetchBundles();
  const grouped = groupBundlesByName(bundles);
  const themeNames = Array.from(grouped.keys()).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-[0.15em] text-[#ece8e1] sm:text-4xl">
          Bundles
        </h1>
        <p className="mt-2 text-sm uppercase tracking-widest text-[#ece8e1]/70">
          Skin bundles by theme — cover art
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {themeNames.map((themeName) => {
          const themeBundles = grouped.get(themeName)!;
          const primary = themeBundles[0];
          const coverUrl =
            primary.verticalPromoImage || primary.displayIcon2 || primary.displayIcon;
          return (
            <Link key={primary.uuid} href={`/bundles/${primary.uuid}`}>
              <TacticalCard className="h-full overflow-hidden" glitch>
                <div className="relative aspect-[3/4] w-full border border-[#ece8e1]/20 bg-[#0f1923]">
                  {coverUrl && (
                    <Image
                      src={coverUrl}
                      alt={primary.displayName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f1923] to-transparent p-3">
                    <p className="text-sm font-bold uppercase tracking-widest text-[#ece8e1]">
                      {themeName}
                    </p>
                    {themeBundles.length > 1 && (
                      <p className="text-[10px] uppercase text-[#ece8e1]/60">
                        {themeBundles.length} variant
                        {themeBundles.length !== 1 ? "s" : ""}
                      </p>
                    )}
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
