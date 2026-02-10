import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  fetchBundles,
  fetchThemes,
  fetchAllSkins,
  getSkinsInBundle,
} from "@/lib/valorant-api";
import { TacticalCard } from "@/components/TacticalCard";

type PageProps = { params: Promise<{ uuid: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { uuid } = await params;
  const bundles = await fetchBundles();
  const bundle = bundles.find((b) => b.uuid === uuid);
  if (!bundle) return { title: "Bundle not found" };
  return {
    title: `${bundle.displayName} Bundle`,
    description: bundle.description || `Valorant ${bundle.displayName} bundle.`,
  };
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function BundleDetailPage({ params }: PageProps) {
  const { uuid } = await params;
  const [bundles, themes, allSkins] = await Promise.all([
    fetchBundles(),
    fetchThemes(),
    fetchAllSkins(),
  ]);
  const bundle = bundles.find((b) => b.uuid === uuid);

  if (!bundle) {
    return (
      <section>
        <h1 className="text-2xl font-bold uppercase text-[#ece8e1]">
          Bundle not found
        </h1>
        <Link
          href="/bundles"
          className="mt-4 inline-block border-2 border-[#ff4655] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#ff4655]"
        >
          ← All bundles
        </Link>
      </section>
    );
  }

  const skinsInBundle = getSkinsInBundle(bundle.displayName, themes, allSkins);
  const coverUrl =
    bundle.verticalPromoImage || bundle.displayIcon2 || bundle.displayIcon;

  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-widest text-[#ece8e1]">
              {bundle.displayName}
            </h1>
            {bundle.displayNameSubText && (
              <p className="mt-1 text-sm uppercase text-[#ece8e1]/70">
                {bundle.displayNameSubText}
              </p>
            )}
            {bundle.description && (
              <p className="mt-3 text-sm text-[#ece8e1]/90">
                {bundle.description}
              </p>
            )}
          </div>
          <TacticalCard glitch={false} className="overflow-hidden">
            <div className="relative aspect-[3/4] max-h-[70vh] w-full bg-[#0f1923]">
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt={bundle.displayName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain"
                  priority
                />
              )}
            </div>
          </TacticalCard>
        </div>
        <aside>
          <Link
            href="/bundles"
            className="inline-block w-full border-2 border-[#ff4655] py-2 text-center text-xs font-bold uppercase tracking-widest text-[#ff4655] transition hover:bg-[#ff4655] hover:text-[#0f1923]"
          >
            ← All bundles
          </Link>
        </aside>
      </div>

      {skinsInBundle.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#ece8e1]/80">
            Weapons in this bundle
          </h2>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4">
              {skinsInBundle.map((skin) => {
                const icon =
                  skin.displayIcon ||
                  skin.chromas?.[0]?.displayIcon ||
                  skin.chromas?.[0]?.fullRender ||
                  skin.levels?.[0]?.displayIcon;
                return (
                  <Link
                    key={skin.uuid}
                    href={`/skins/${skin.uuid}`}
                    className="shrink-0"
                  >
                    <TacticalCard className="w-36" glitch>
                      <div className="relative aspect-[2/1] w-full border border-[#ece8e1]/20 bg-[#0f1923]">
                        {icon && (
                          <Image
                            src={icon}
                            alt={skin.displayName}
                            fill
                            sizes="144px"
                            className="object-contain p-2"
                          />
                        )}
                      </div>
                      <p className="mt-2 truncate text-center text-[10px] font-bold uppercase tracking-wider text-[#ece8e1]">
                        {skin.displayName}
                      </p>
                      <p className="text-center text-[9px] uppercase text-[#ece8e1]/50">
                        {skin.weaponName}
                      </p>
                    </TacticalCard>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
