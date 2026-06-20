import React from "react";
import { AbsoluteFill } from "remotion";

export interface AestheticContainerProps {
  children: React.ReactNode;
  showGrain?: boolean;
  showVignette?: boolean;
  showBorder?: boolean;
  themeColor?: string;
}

export const AestheticContainer: React.FC<AestheticContainerProps> = ({
  children,
  showGrain = true,
  showVignette = true,
  showBorder = true,
  themeColor = "#c89547",
}) => {
  return (
    <AbsoluteFill
      className="bg-vintage-bg text-vintage-paper font-sans overflow-hidden select-none"
      style={{
        "--color-vintage-gold": themeColor,
      } as React.CSSProperties}
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(62,52,44,0.15)_0%,rgba(28,24,21,1)_80%)]" />

      {/* Main Content Area */}
      <AbsoluteFill className="z-10 flex flex-col items-center justify-center">
        {children}
      </AbsoluteFill>

      {/* Inner Elegant Border */}
      {showBorder && (
        <div className="absolute inset-6 border border-vintage-border/40 pointer-events-none z-20 rounded-sm" />
      )}

      {/* Vignette Shadow Overlay */}
      {showVignette && (
        <div className="absolute inset-0 vignette-overlay pointer-events-none z-30" />
      )}

      {/* Color Grading Warm Sepia Tint */}
      <div className="absolute inset-0 cinematic-tint pointer-events-none z-40" />

      {/* Dynamic SVG-based Film Grain Layer */}
      {showGrain && (
        <div className="absolute -inset-[50%] w-[200%] h-[200%] opacity-[0.06] pointer-events-none mix-blend-overlay z-50 animate-grain">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <filter id="noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.75"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};
