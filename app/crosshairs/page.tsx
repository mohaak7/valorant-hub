import type { Metadata } from "next";
import { TacticalCard } from "@/components/TacticalCard";
import { CrosshairPreview } from "@/components/CrosshairPreview";
import { CrosshairCopyButton } from "./CrosshairCopyButton";

export const metadata: Metadata = {
  title: "Pro Crosshairs | Valorant Crosshair Codes",
  description:
    "5–6 popular pro-player Valorant crosshair codes with preview. Copy and paste into your game.",
};

const CROSSHAIRS = [
  {
    id: "1",
    player: "TenZ",
    description: "Dot with thin cross, minimal",
    code: "0;P;c;5;o;0;d;1;z;3;0b;0;1b;0",
    dot: true,
    lineLength: 6,
    thickness: 1,
    gap: 2,
  },
  {
    id: "2",
    player: "yay",
    description: "Small dot, no lines",
    code: "0;P;c;1;o;0;d;1;z;3;0b;0;1b;0",
    dot: true,
    lineLength: 0,
    thickness: 1,
    gap: 0,
  },
  {
    id: "3",
    player: "Demon1",
    description: "T-style with dot",
    code: "0;P;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1b;0",
    dot: true,
    lineLength: 8,
    thickness: 2,
    gap: 1,
  },
  {
    id: "4",
    player: "Aspas",
    description: "Classic cross, small gap",
    code: "0;P;c;5;o;0.5;d;1;z;3;0b;0;1b;0",
    dot: true,
    lineLength: 5,
    thickness: 1,
    gap: 3,
  },
  {
    id: "5",
    player: "Chronicle",
    description: "Thin lines, dot",
    code: "0;P;c;5;o;0;d;1;z;2;0b;0;1b;0",
    dot: true,
    lineLength: 7,
    thickness: 1,
    gap: 2,
  },
  {
    id: "6",
    player: "cNed",
    description: "Compact cross, dot",
    code: "0;P;c;4;o;0;d;1;z;2;0b;0;1b;0",
    dot: true,
    lineLength: 5,
    thickness: 1,
    gap: 2,
  },
];

export default function CrosshairsPage() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-[0.15em] text-[#ece8e1] sm:text-4xl">
          Crosshairs
        </h1>
        <p className="mt-2 text-sm uppercase tracking-widest text-[#ece8e1]/70">
          Pro-player crosshair codes — copy &amp; paste
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CROSSHAIRS.map((ch) => (
          <TacticalCard key={ch.id} glitch>
            <div className="flex flex-col items-center gap-4">
              <CrosshairPreview
                dot={ch.dot}
                lineLength={ch.lineLength}
                thickness={ch.thickness}
                gap={ch.gap}
                className="border border-[#ece8e1]/20"
              />
              <div className="w-full text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-[#ff4655]">
                  {ch.player}
                </p>
                <p className="mt-1 text-[11px] text-[#ece8e1]/70">
                  {ch.description}
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
