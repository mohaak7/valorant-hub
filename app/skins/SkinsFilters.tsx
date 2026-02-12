"use client";

import { useRouter, useSearchParams } from "next/navigation";

type SkinsFiltersProps = {
  weaponOptions: string[];
  tierOptions: { uuid: string; displayName: string }[];
  currentWeapon: string;
  currentTier: string;
  currentQ: string;
  currentSort: string;
};

export function SkinsFilters({
  weaponOptions,
  tierOptions,
  currentWeapon,
  currentTier,
  currentQ,
  currentSort,
}: SkinsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: "weapon" | "tier" | "sort", value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/skins?${next.toString()}`);
  }

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
            Search
          </span>
          <input
            type="search"
            name="q"
            defaultValue={currentQ}
            placeholder="Skin or weapon name..."
            className="w-40 border border-[#ece8e1]/30 bg-[#0f1923] px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-[#ece8e1] placeholder:text-[#ece8e1]/40 focus:border-[#ff4655] focus:outline-none sm:w-52"
          />
        </label>
        <button
          type="submit"
          className="border-2 border-[#ff4655] bg-[#ff4655] px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0f1923] transition hover:bg-[#ece8e1]"
        >
          Apply
        </button>
      </form>
      <label className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#ece8e1]/70">
          Weapon
        </span>
        <select
          value={currentWeapon}
          onChange={(e) => updateFilter("weapon", e.target.value)}
          className="border border-[#ece8e1]/30 bg-[#0f1923] px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ece8e1] focus:border-[#ff4655] focus:outline-none"
        >
          <option value="">All</option>
          {weaponOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#ece8e1]/70">
          Sort
        </span>
        <select
          value={currentSort || "name"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="border border-[#ece8e1]/30 bg-[#0f1923] px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ece8e1] focus:border-[#ff4655] focus:outline-none"
        >
          <option value="name">Name (A-Z)</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </label>
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
