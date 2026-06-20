import React from "react";
import { AbsoluteFill } from "remotion";


export interface AestheticContainerProps {
  children: React.ReactNode;
  showGrain?: boolean;
  showVignette?: boolean;
  showBorder?: boolean;
  themeColor?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

// Parse hex string to HSL color values
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace(/^#/, "");
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Generate aesthetic matching dark theme palette based on the chosen accent theme color
function getDerivedColors(themeColor: string, customBg?: string, customText?: string, customBorder?: string) {
  let h = 35;
  let s = 25;
  
  try {
    if (themeColor && themeColor.startsWith("#")) {
      const hsl = hexToHsl(themeColor);
      h = hsl.h;
      s = hsl.s;
    }
  } catch (err) {
    console.error("Failed to parse theme color:", err);
  }

  // Base derivations:
  // background: very dark, low saturation hue-tinted slate (6% lightness)
  const bg = customBg || `hsl(${h}, ${Math.max(6, Math.round(s * 0.35))}%, 6%)`;
  // text: high contrast slightly-tinted bone paper (95% lightness)
  const text = customText || `hsl(${h}, ${Math.min(12, Math.round(s * 0.2))}%, 95%)`;
  // border: matching mid-dark outline color (18% lightness)
  const border = customBorder || `hsl(${h}, ${Math.max(10, Math.round(s * 0.3))}%, 18%)`;
  // muted: matching mid-light gray (55% lightness)
  const muted = `hsl(${h}, ${Math.max(8, Math.round(s * 0.25))}%, 55%)`;
  // glow: low opacity (12%) version of the accent color
  const glow = `hsla(${h}, ${s}%, 50%, 0.12)`;
  // tint: cinematic photo-color grading tint (1.5% opacity)
  const tint = `hsla(${h}, ${s}%, 50%, 0.015)`;

  return { bg, text, border, muted, glow, tint };
}

export const AestheticContainer: React.FC<AestheticContainerProps> = ({
  children,
  showGrain = true,
  showVignette = true,
  showBorder = true,
  themeColor = "#c89547",
  textColor,
  backgroundColor,
  borderColor,
}) => {
  const derived = getDerivedColors(themeColor, backgroundColor, textColor, borderColor);

  return (
    <AbsoluteFill
      className="bg-vintage-bg text-vintage-paper font-sans overflow-hidden select-none"
      style={{
        "--color-vintage-gold": themeColor,
        "--color-vintage-bg": derived.bg,
        "--color-vintage-paper": derived.text,
        "--color-vintage-border": derived.border,
        "--color-vintage-muted": derived.muted,
        "--color-theme-glow": derived.glow,
        "--color-theme-tint": derived.tint,
      } as React.CSSProperties}
    >
      {/* Background Subtle Radial Glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, var(--color-theme-glow) 0%, var(--color-vintage-bg) 85%)"
        }}
      />

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

      {/* Color Grading Warm Tint */}
      <div 
        className="absolute inset-0 pointer-events-none z-40" 
        style={{
          mixBlendMode: "color-burn",
          backgroundColor: "var(--color-theme-tint)",
        }}
      />

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
