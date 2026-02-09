"use client";

type CrosshairPreviewProps = {
  dot?: boolean;
  lineLength?: number;
  thickness?: number;
  gap?: number;
  className?: string;
};

export function CrosshairPreview({
  dot = true,
  lineLength = 8,
  thickness = 1,
  gap = 2,
  className = "",
}: CrosshairPreviewProps) {
  const total = lineLength * 2 + gap * 2 + (dot ? 6 : 0);
  const size = Math.max(total, 32);

  return (
    <div
      className={`relative flex items-center justify-center border border-[#ece8e1]/20 bg-[#0f1923] ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: gap * 2 + (lineLength > 0 ? lineLength * 2 + thickness : 0),
          height: gap * 2 + (lineLength > 0 ? lineLength * 2 + thickness : 0),
          transform: "translate(-50%, -50%)",
        }}
      >
        {lineLength > 0 && (
          <>
            <div
              className="absolute bg-[#ece8e1]"
              style={{
                left: "50%",
                top: 0,
                width: thickness,
                height: lineLength,
                transform: "translateX(-50%)",
              }}
            />
            <div
              className="absolute bg-[#ece8e1]"
              style={{
                left: "50%",
                bottom: 0,
                width: thickness,
                height: lineLength,
                transform: "translateX(-50%)",
              }}
            />
            <div
              className="absolute bg-[#ece8e1]"
              style={{
                left: 0,
                top: "50%",
                width: lineLength,
                height: thickness,
                transform: "translateY(-50%)",
              }}
            />
            <div
              className="absolute bg-[#ece8e1]"
              style={{
                right: 0,
                top: "50%",
                width: lineLength,
                height: thickness,
                transform: "translateY(-50%)",
              }}
            />
          </>
        )}
        {dot && (
          <div
            className="absolute left-1/2 top-1/2 rounded-full bg-[#ff4655]"
            style={{
              width: 2,
              height: 2,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
