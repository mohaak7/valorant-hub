"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useLanguage } from "@/lib/lang-context";

type SkinsFiltersProps = {
  weaponOptions: string[];
  tierOptions: { uuid: string; displayName: string }[];
  currentWeapon: string;
  currentTier: string;
  currentQ: string;
  currentSort: string;
  currentDir: "asc" | "desc";
};

export function SkinsFilters({
  weaponOptions,
  tierOptions,
  currentWeapon,
  currentTier,
  currentQ,
  currentSort,
  currentDir,
}: SkinsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  function updateFilter(
    key: "weapon" | "tier" | "sort" | "dir",
    value: string
  ) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/skins?${next.toString()}`);
  }

  function handleSortChange(value: string) {
    const next = new URLSearchParams(searchParams);
    next.set("sort", value);
    if (value === "price" || value === "newest") {
      next.set("dir", "desc");
    }
    router.push(`/skins?${next.toString()}`);
  }

  function toggleSortDirection() {
    updateFilter("dir", currentDir === "asc" ? "desc" : "asc");
  }

  const isSortByPrice = currentSort === "price";
  const isSortByNewest = currentSort === "newest";
  const canToggleDirection = isSortByPrice || isSortByNewest;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <form
        action="/skins"
        method="get"
        className="flex flex-wrap items-center gap-2"
      >
        {currentWeapon ? (
          <input type="hidden" name="weapon" value={currentWeapon} />
        ) : null}
        {currentTier ? (
          <input type="hidden" name="tier" value={currentTier} />
        ) : null}
        <label className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#ece8e1]/70">
            {t.common.search}
          </span>
          <input
            type="search"
            name="q"
            defaultValue={currentQ}
            placeholder={t.filters.search}
            className="w-40 border border-[#ece8e1]/30 bg-[#0f1923] px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-[#ece8e1] placeholder:text-[#ece8e1]/40 focus:border-[#ff4655] focus:outline-none sm:w-52"
          />
        </label>
        <button
          type="submit"
          className="border-2 border-[#ff4655] bg-[#ff4655] px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0f1923] transition hover:bg-[#ece8e1]"
        >
          {t.common.submit}
        </button>
      </form>
      <label className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#ece8e1]/70">
          {t.filters.allWeapons}
        </span>
        <select
          value={currentWeapon}
          onChange={(e) => updateFilter("weapon", e.target.value)}
          className="border border-[#ece8e1]/30 bg-[#0f1923] px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ece8e1] focus:border-[#ff4655] focus:outline-none"
        >
          <option value="">{t.filters.allWeapons}</option>
          {weaponOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-1">
        <label className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#ece8e1]/70">
            {t.filters.sort}
          </span>
          <select
            value={currentSort || "name"}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-[#ece8e1]/30 bg-[#0f1923] px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ece8e1] focus:border-[#ff4655] focus:outline-none"
          >
            <option value="name">Name (A-Z)</option>
            <option value="newest">{t.filters.newest}</option>
            <option value="price">Price (VP)</option>
          </select>
        </label>
        <button
          type="button"
          onClick={toggleSortDirection}
          disabled={!canToggleDirection}
          aria-label={
            currentDir === "asc"
              ? "Sort ascending (click for descending)"
              : "Sort descending (click for ascending)"
          }
          className="flex h-[34px] w-9 items-center justify-center rounded border border-[#ece8e1]/30 bg-[#0f1923] text-[#ece8e1] transition hover:border-[#ff4655] hover:bg-[#0f1923]/90 hover:text-[#ff4655] disabled:pointer-events-none disabled:opacity-50"
        >
          {currentDir === "asc" ? (
            <ArrowUp className="h-4 w-4" aria-hidden />
          ) : (
            <ArrowDown className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
      <label className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#ece8e1]/70">
          Tier
        </span>
        <select
          value={currentTier}
          onChange={(e) => updateFilter("tier", e.target.value)}
          className="border border-[#ece8e1]/30 bg-[#0f1923] px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ece8e1] focus:border-[#ff4655] focus:outline-none"
        >
          <option value="">All</option>
          {tierOptions.map((t) => (
            <option key={t.uuid} value={t.uuid}>
              {t.displayName}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
