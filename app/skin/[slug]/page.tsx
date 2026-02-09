import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllSkins, getSkinBySlug } from "@/lib/skins";
import { seoKeywordsBase } from "@/lib/siteConfig";

type SkinPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSkins().map((skin) => ({
    slug: skin.slug,
  }));
}

export async function generateMetadata(
  props: SkinPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const skin = getSkinBySlug(slug);

  if (!skin) {
    return {
      title: "Valorant skin not found",
      description:
        "This Valorant skin could not be found in our cheap price & VP cost database.",
    };
  }

  const baseTitle = `${skin.name} price & VP cost`;

  return {
    title: `Cheap ${baseTitle} tracker`,
    description: `Track the cheap ${skin.name} Valorant skin price, VP cost estimates, and simple price history before checking the real market.`,
    keywords: [
      ...seoKeywordsBase,
      skin.name,
      `${skin.name} price`,
      `${skin.name} VP cost`,
      `${skin.weapon} skins`,
      `cheap ${skin.name} skin`,
      "Valorant skin price tracker",
    ],
  };
}

export default async function SkinPage(props: SkinPageProps) {
  const { slug } = await props.params;
  const skin = getSkinBySlug(slug);

  if (!skin) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-50">
          Skin not found
        </h1>
        <p className="text-sm text-slate-400">
          This Valorant skin is not in our static price database yet. Try
          another search or check live offers on the official market.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 ring-1 ring-slate-700 transition hover:bg-slate-800 hover:ring-fuchsia-500/60"
        >
          ← Back to search
        </Link>
      </section>
    );
  }

  const latestPrice = skin.priceHistory.at(-1)?.vp ?? skin.estimatedVpPrice;

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300 ring-1 ring-slate-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          Live price estimate
        </div>
        <div className="space-y-3">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            {skin.name}{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              price &amp; VP cost
            </span>
          </h1>
          <p className="text-sm text-slate-300">
            Unofficial Valorant skin price tracker for{" "}
            <span className="font-semibold text-slate-100">
              {skin.weapon}
            </span>{" "}
            players. See the estimated VP cost, simple price history and then
            click through to check the real market price.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
              Estimated VP cost
            </p>
            <p className="mt-1 text-3xl font-semibold text-emerald-300">
              ~{latestPrice.toLocaleString()} VP
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Based on static shop pricing. Real promotions and discounts will
              be different.
            </p>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-slate-800/0 via-slate-700/80 to-slate-800/0" />
          <div className="space-y-1 text-xs text-slate-300">
            <p>
              • Great for{" "}
              <span className="font-semibold text-slate-100">
                cheap VP budgeting
              </span>
            </p>
            <p>• Compare bundles vs. single skin cost</p>
            <p>• Use with your daily store rotation</p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
            VP cost history (mock data)
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4">
            <div className="flex flex-col gap-3 text-xs text-slate-300 sm:flex-row sm:items-end sm:justify-between">
              <p>
                Simple mock VP history to showcase the price tracking layout.
                Replace this with real time-series data later.
              </p>
              <p className="text-[11px] text-slate-500">
                VP values are illustrative only and do not represent live
                prices.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-200">
              {skin.priceHistory.map((point) => (
                <div
                  key={point.date}
                  className="flex flex-col gap-1 rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800"
                >
                  <span className="text-[11px] text-slate-400">
                    {new Date(point.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-sm font-semibold text-emerald-300">
                    {point.vp.toLocaleString()} VP
                  </span>
                  <span className="h-1 rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-400 to-cyan-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-[0_0_50px_rgba(15,23,42,1)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.25),_transparent_60%)]" />
          <div className="relative space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Skin preview
              </span>
              <span className="rounded-full bg-slate-900/90 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-300 ring-1 ring-slate-700">
                Static image
              </span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950">
              <div className="relative aspect-[16/7]">
                <Image
                  src={skin.imageUrl}
                  alt={`${skin.name} Valorant skin artwork`}
                  fill
                  sizes="(min-width: 1024px) 360px, 100vw"
                  className="object-contain object-center"
                  priority
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Artwork and marks are property of Riot Games. Images used here as
              static references only.
            </p>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-100">
          <p className="font-semibold uppercase tracking-[0.22em]">
            Pro tip: buy cheap
          </p>
          <p>
            Use the{" "}
            <span className="font-semibold">estimated VP cost + history</span>{" "}
            as a sanity check before you spend. Discounts and bundles can make
            some skins effectively cheaper than they look in the store.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-100 ring-1 ring-slate-700 transition hover:bg-slate-800 hover:ring-fuchsia-500/70"
        >
          ← Back to all Valorant skins
        </Link>
      </aside>
    </section>
  );
}

