"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useLanguage } from "@/lib/lang-context";

export function CrosshairCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Button
        type="button"
        onClick={copy}
        className="shrink-0 gap-1 border-[#ff4655] bg-[#0f1923] text-[10px] text-[#ff4655] hover:bg-[#ff4655] hover:text-[#0f1923]"
      >
        {copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
        <span>{copied ? "Copied" : t.buttons.copy}</span>
      </Button>
      {copied && (
        <div className="fixed bottom-4 right-4 rounded-md border border-[#ff4655] bg-[#0f1923]/95 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[#ece8e1] shadow-lg">
          Copied!
        </div>
      )}
    </>
  );
}
