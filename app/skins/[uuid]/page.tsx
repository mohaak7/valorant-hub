import type { Metadata } from "next";
import Link from "next/link";
import { fetchWeapons, fetchContentTiers } from "@/lib/valorant-api";
import { TacticalCard } from "@/components/TacticalCard";
import { SkinDetailClient } from "./SkinDetailClient";

type PageProps = { params: Promise<{ uuid: string }> };

async function getSkinByUuid(uuid: string) {
  const weapons = await fetchWeapons();
  for (const w of weapons) {
    const skin = w.skins.find((s) => s.uuid === uuid);
    if (skin)
      return {
        skin: {
          ...skin,
          weaponName: w.displayName,
          weaponUuid: w.uuid,
        },
        weapon: w,
      };
  }
  return null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { uuid } = await params;
  const data = await getSkinByUuid(uuid);
  if (!data) return { title: "Skin not found" };
  return {
    title: `${data.skin.displayName} | ${data.skin.weaponName} Skin`,
    description: `Valorant ${data.skin.displayName} skin for ${data.skin.weaponName}.`,
  };
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function SkinDetailPage({ params }: PageProps) {
  const { uuid } = await params;
  const [data, tiers] = await Promise.all([
    getSkinByUuid(uuid),
    fetchContentTiers(),
  ]);

  if (!data) {
    return (
      <section>
        <h1 className="text-2xl font-bold uppercase text-[#ece8e1]">
          Skin not found
        </h1>
        <Link
          href="/skins"
          className="mt-4 inline-block border-2 border-[#ff4655] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#ff4655]"
        >
          ← All skins
        </Link>
      </section>
    );
  }

  const { skin, weapon } = data;
  const tier = tiers.find((t) => t.uuid === skin.contentTierUuid);

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr,320px]">
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ff4655]">
            {skin.weaponName}
          </p>
          <h1 className="text-3xl font-bold uppercase tracking-widest text-[#ece8e1]">
            {skin.displayName}
          </h1>
          {tier && (
            <p className="text-sm uppercase tracking-widest text-[#ece8e1]/70">
              {tier.displayName}
            </p>
          )}
        </div>
        <SkinDetailClient
          skin={{
            displayName: skin.displayName,
            chromas: skin.chromas ?? [],
            levels: skin.levels ?? [],
          }}
        />
      </div>
      <aside className="space-y-4">
        <TacticalCard glitch={false}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#ece8e1]/70">
            Weapon
          </p>
          <p className="mt-1 text-sm font-bold uppercase text-[#ece8e1]">
            {skin.weaponName}
          </p>
        </TacticalCard>
        <Link
          href="/skins"
          className="inline-block w-full border-2 border-[#ff4655] py-2 text-center text-xs font-bold uppercase tracking-widest text-[#ff4655] transition hover:bg-[#ff4655] hover:text-[#0f1923]"
        >
          ← All skins
        </Link>
      </aside>
    </section>
  );
}
