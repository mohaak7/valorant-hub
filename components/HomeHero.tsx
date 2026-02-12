"use client";

import { useLanguage } from "@/lib/lang-context";

export function HomeHero() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="glitch-hover text-balance text-3xl font-bold uppercase tracking-[0.12em] text-[#ece8e1] sm:text-4xl md:text-5xl">
        <span className="glitch-text">{t.hero.title}</span>
      </h1>
      <p className="mt-4 text-sm uppercase tracking-widest text-[#ece8e1]/70 sm:text-base">
        {t.hero.subtitle}
      </p>
    </div>
  );
}

