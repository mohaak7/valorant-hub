"use client";

import { TacticalCard } from "@/components/TacticalCard";
import { CrosshairPreview } from "@/components/CrosshairPreview";
import { CrosshairCopyButton } from "./CrosshairCopyButton";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const PRO_CROSSHAIRS = [
  {
    name: "TenZ",
    team: "Sentinels",
    code: "0;s;1;P;c;5;h;0;m;1;0l;4;0o;2;0a;1;0f;0;1b;0;S;c;5;o;1",
    preview: { dot: true, lineLength: 6, thickness: 2, gap: 2 },
  },
  {
    name: "yay",
    team: "Bleed",
    code: "0;P;c;1;o;0;d;1;z;3;0b;0;1b;0",
    preview: { dot: true, lineLength: 0, thickness: 2, gap: 0 },
  },
  {
    name: "aspas",
    team: "Leviatán",
    code: "0;P;c;5;o;0.5;d;1;z;3;0b;0;1b;0",
    preview: { dot: true, lineLength: 5, thickness: 1, gap: 3 },
  },
  {
    name: "Demon1",
    team: "NRG",
    code: "0;P;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1b;0",
    preview: { dot: true, lineLength: 8, thickness: 2, gap: 1 },
  },
  {
    name: "cNed",
    team: "NAVI",
    code: "0;P;c;4;o;0;d;1;z;2;0b;0;1b;0",
    preview: { dot: true, lineLength: 5, thickness: 1, gap: 2 },
  },
  {
    name: "Chronicle",
    team: "Fnatic",
    code: "0;P;c;5;o;0;d;1;z;2;0b;0;1b;0",
    preview: { dot: true, lineLength: 7, thickness: 1, gap: 2 },
  },
];

export default function CrosshairsPage() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.15em] text-[#ece8e1] sm:text-4xl">
            Pro &amp; Community Crosshairs
          </h1>
          <p className="mt-2 text-sm uppercase tracking-widest text-[#ece8e1]/70">
            Copy pro codes in one click — or submit your own setup.
          </p>
        </div>
        <Button
          onClick={() =>
            window.open("https://forms.gle/TXTJcJeNyVpHMNhw5", "_blank")
          }
          className="gap-2 bg-transparent text-[11px] text-[#ff4655] hover:bg-[#ff4655] hover:text-[#0f1923]"
        >
          <ExternalLink className="h-4 w-4" />
          <span>SUBMIT YOUR OWN CROSSHAIR</span>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRO_CROSSHAIRS.map((ch) => (
          <TacticalCard key={ch.name} glitch>
            <div className="flex flex-col items-center gap-4">
              <CrosshairPreview
                dot={ch.preview.dot}
                lineLength={ch.preview.lineLength}
                thickness={ch.preview.thickness}
                gap={ch.preview.gap}
                className="border border-[#ece8e1]/20"
              />
              <div className="w-full text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-[#ff4655]">
                  {ch.name}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-[#ece8e1]/70">
                  {ch.team}
                </p>
              </div>
              <div className="flex w-full items-center gap-2">
                <code className="flex-1 truncate border border-[#ece8e1]/20 bg-[#0f1923] px-2 py-1.5 text-[10px] uppercase text-[#ece8e1]/90">
                  {ch.code}
                </code>
                <CrosshairCopyButton code={ch.code} />
              </div>
            </div>
          </TacticalCard>
        ))}
      </div>
    </section>
  );
}
