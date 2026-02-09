"use client";

import { useState } from "react";

export function CrosshairCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 border-2 border-[#ff4655] bg-[#0f1923] px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#ff4655] transition hover:bg-[#ff4655] hover:text-[#0f1923]"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
