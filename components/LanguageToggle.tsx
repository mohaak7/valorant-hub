"use client";

import { useLanguage } from "@/lib/lang-context";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ece8e1]/60">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-1 transition ${
          lang === "en"
            ? "text-[#ff4655]"
            : "text-[#ece8e1]/50 hover:text-[#ece8e1]"
        }`}
      >
        EN
      </button>
      <span>|</span>
      <button
        type="button"
        onClick={() => setLang("es")}
        className={`px-1 transition ${
          lang === "es"
            ? "text-[#ff4655]"
            : "text-[#ece8e1]/50 hover:text-[#ece8e1]"
        }`}
      >
        ES
      </button>
    </div>
  );
}

