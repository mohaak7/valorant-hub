"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "es";

type NavTranslations = {
  home: string;
  agents: string;
  skins: string;
  bundles: string;
  crosshairs: string;
  agentRoulette: string;
  skinRoulette: string;
};

type HeroTranslations = {
  title: string;
  subtitle: string;
};

type CommonTranslations = {
  search: string;
  loading: string;
  submit: string;
  copyCode: string;
  myInventory: string;
};

type RouletteTranslations = {
  heading: string;
  step1: string;
  step2: string;
  step3: string;
  spin: string;
  allSkins: string;
  mySelection: string;
  selectAll: string;
  clear: string;
  selectPrompt: string;
  noSkinsForWeapon: (weapon: string) => string;
};

type CrosshairsTranslations = {
  title: string;
  subtitle: string;
  submitCta: string;
};

type Translations = {
  nav: NavTranslations;
  hero: HeroTranslations;
  common: CommonTranslations;
  roulette: RouletteTranslations;
  crosshairs: CrosshairsTranslations;
  filters: {
    search: string;
    sort: string;
    newest: string;
    oldest: string;
    priceLow: string;
    priceHigh: string;
    allWeapons: string;
  };
  buttons: {
    loadMore: string;
    spin: string;
    spinOwned: string;
    copy: string;
    submit: string;
  };
  headers: {
    skins: string;
    agents: string;
    crosshairs: string;
  };
};

const translations: Record<Lang, Translations> = {
  en: {
    nav: {
      home: "Home",
      agents: "Agents",
      skins: "Skins",
      bundles: "Bundles",
      crosshairs: "Crosshairs",
      agentRoulette: "Agent Roulette",
      skinRoulette: "Skin Roulette",
    },
    hero: {
      title: "VALORANT SKINS, AGENTS & CROSSHAIRS",
      subtitle:
        "The ultimate toolkit: Database, Price Tracker, Crosshairs & Randomizers.",
    },
    common: {
      search: "Search",
      loading: "Loading…",
      submit: "Submit",
      copyCode: "Copy Code",
      myInventory: "My Inventory",
    },
    roulette: {
      heading: "Skin Roulette",
      step1: "Step 1 — Select weapon",
      step2: "Step 2 — Roulette",
      step3: "Step 3 — Choose skins for pool",
      spin: "Spin",
      allSkins: "All Skins",
      mySelection: "My Selection",
      selectAll: "Select all",
      clear: "Clear",
      selectPrompt: "Select some skins to start spinning!",
      noSkinsForWeapon: (weapon) =>
        `No skins in Select+ tiers for ${weapon}. Pick another weapon.`,
    },
    crosshairs: {
      title: "Pro & Community Crosshairs",
      subtitle: "Copy pro codes in one click — or submit your own setup.",
      submitCta: "Submit Your Crosshair",
    },
    filters: {
      search: "Search skins...",
      sort: "Sort By",
      newest: "Newest",
      oldest: "Oldest",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      allWeapons: "All Weapons",
    },
    buttons: {
      loadMore: "Load More",
      spin: "SPIN",
      spinOwned: "Spin Owned Only",
      copy: "Copy Code",
      submit: "Submit Crosshair",
    },
    headers: {
      skins: "Skins Database",
      agents: "Agent Picker",
      crosshairs: "Pro Crosshairs",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      agents: "Agentes",
      skins: "Skins",
      bundles: "Lotes",
      crosshairs: "Miras",
      agentRoulette: "Ruleta de Agentes",
      skinRoulette: "Ruleta de Skins",
    },
    hero: {
      title: "SKINS, AGENTES Y RULETA DE VALORANT",
      subtitle:
        "La herramienta definitiva: Base de datos, Precios, Miras y Ruleta.",
    },
    common: {
      search: "Buscar",
      loading: "Cargando…",
      submit: "Enviar",
      copyCode: "Copiar código",
      myInventory: "Mi inventario",
    },
    roulette: {
      heading: "Ruleta de Skins",
      step1: "Paso 1 — Elige arma",
      step2: "Paso 2 — Ruleta",
      step3: "Paso 3 — Elige skins para el pool",
      spin: "Girar",
      allSkins: "Todas las skins",
      mySelection: "Mi selección",
      selectAll: "Seleccionar todo",
      clear: "Limpiar",
      selectPrompt: "Selecciona al menos una skin para empezar a girar.",
      noSkinsForWeapon: (weapon) =>
        `No hay skins Select+ para ${weapon}. Prueba con otra arma.`,
    },
    crosshairs: {
      title: "Miras Pro y de la Comunidad",
      subtitle:
        "Copia miras de pros en un clic o envía tu propia configuración.",
      submitCta: "Enviar mi mira",
    },
    filters: {
      search: "Buscar skins...",
      sort: "Ordenar por",
      newest: "Más Nuevos",
      oldest: "Más Antiguos",
      priceLow: "Precio: Bajo a Alto",
      priceHigh: "Precio: Alto a Bajo",
      allWeapons: "Todas las Armas",
    },
    buttons: {
      loadMore: "Cargar Más",
      spin: "GIRAR",
      spinOwned: "Girar Solo Mis Skins",
      copy: "Copiar Código",
      submit: "Enviar Tu Mira",
    },
    headers: {
      skins: "Base de Datos de Skins",
      agents: "Selector de Agentes",
      crosshairs: "Miras de Pros",
    },
  },
};

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "es") {
        setLangState(stored);
        return;
      }
      const navLang = window.navigator.language || "";
      if (navLang.toLowerCase().startsWith("es")) {
        setLangState("es");
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  function setLang(next: Lang) {
    setLangState(next);
  }

  const value: LanguageContextValue = {
    lang,
    setLang,
    t: translations[lang],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

