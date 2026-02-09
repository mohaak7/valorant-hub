import type { ReactNode } from "react";

type TacticalCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
  glitch?: boolean;
};

export function TacticalCard({
  children,
  className = "",
  as: Component = "div",
  glitch = true,
}: TacticalCardProps) {
  return (
    <Component
      className={[
        "relative clip-tactical border border-[#ece8e1]/20 bg-[#0f1923]/90 p-4 transition-colors hover:border-[#ff4655]/50",
        glitch ? "glitch-hover" : "",
        className,
      ].join(" ")}
    >
      {children}
    </Component>
  );
}
