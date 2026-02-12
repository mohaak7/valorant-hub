"use client";

import { useLanguage } from "@/lib/lang-context";

export function SkinsPageHeader() {
  const { t } = useLanguage();
  return (
    <div>
      <h1 className="text-3xl font-bold uppercase tracking-[0.15em] text-[#ece8e1] sm:text-4xl">
        {t.headers.skins}
      </h1>
      <p className="mt-2 text-sm uppercase tracking-widest text-[#ece8e1]/70">
        Filter by weapon type &amp; tier
      </p>
    </div>
  );
}
