import React from "react";
import { Img, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadTech } from "@remotion/google-fonts/ShareTechMono";
import { ShieldAlert, Crosshair } from "lucide-react";
import { MotionDiv } from "../components/Motion";
import "./styles/SceneCyberpunk.css";

const { fontFamily: techFont } = loadTech("normal", { weights: ["400"] });

interface SceneCyberpunkProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  customProps?: {
    badgeText?: string;
    metricLabel?: string;
    metricValue?: string;
    [key: string]: unknown;
  };
}

export const SceneCyberpunk: React.FC<SceneCyberpunkProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  customProps = {},
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const headerBadge = customProps?.badgeText || subtitle || "SYS ALERT";
  const warningLabel = customProps?.metricLabel || "THREAT DETECTED";
  const statusMsg = customProps?.metricValue || description;

  // Background slow drift
  const bgScale = interpolate(frame, [0, 300], [1.04, 1.11], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Vertical scanline sweep position over 80 frames loop
  const scanlineY = interpolate(frame % 80, [0, 79], [-10, 110]);

  // HUD crosshair rotation based on frame
  const crosshairRot = interpolate(frame, [0, 300], [0, 180]);

  // Target system warning flash
  const warnOpacity = interpolate(Math.sin(frame * 0.25), [-1, 1], [0.3, 1]);

  // Generate Matrix falling columns of binary code based on frame
  const generateBinaryStream = (seed: number, length: number) => {
    const stream = [];
    const visibleLength = Math.min(length, Math.floor(frame / 2.5) + (seed % 4));
    for (let j = 0; j < visibleLength; j++) {
      const bit = (Math.sin(seed + j * 0.9) > 0) ? "1" : "0";
      stream.push(bit);
    }
    return stream.join("");
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center h-full w-full cyber-container overflow-hidden select-none p-6 md:p-12 text-center"
      style={{ fontFamily: techFont }}
    >
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none -z-10" />

      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden opacity-10">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover filter hue-rotate-60"
            style={{
              transform: `scale(${bgScale})`,
            }}
          />
        </div>
      )}

      {/* Cyber HUD Overlays */}
      <div 
        className={`absolute rounded-full hud-ring flex items-center justify-center pointer-events-none opacity-30 ${
          isVertical ? "left-4 top-4 w-16 h-16" : "left-10 w-24 h-24"
        }`}
        style={{ transform: `rotate(${crosshairRot}deg)` }}
      >
        <Crosshair className="w-6 h-6 text-cyan-400" />
      </div>

      <div 
        className={`absolute rounded hud-ring flex items-center justify-center pointer-events-none opacity-20 ${
          isVertical ? "right-4 bottom-4 w-12 h-12" : "right-12 w-16 h-16"
        }`}
        style={{ transform: `rotate(${-crosshairRot * 1.5}deg)` }}
      >
        <div className="w-8 h-8 border border-dotted border-cyan-400" />
      </div>

      {/* Matrix falling binary code overlays on sides (hidden on very small vertical screens if narrow) */}
      <div className="absolute left-3 top-12 bottom-12 w-8 font-mono text-[8px] text-cyan-400/30 select-none pointer-events-none text-left leading-none tracking-widest break-all overflow-hidden matrix-stream">
        <div>{generateBinaryStream(11, 35)}</div>
        <div className="mt-4">{generateBinaryStream(25, 25)}</div>
      </div>
      <div className="absolute right-3 top-12 bottom-12 w-8 font-mono text-[8px] text-cyan-400/30 select-none pointer-events-none text-right leading-none tracking-widest break-all overflow-hidden matrix-stream">
        <div>{generateBinaryStream(42, 30)}</div>
        <div className="mt-4">{generateBinaryStream(57, 40)}</div>
      </div>

      {/* Sweeping Scanline */}
      <div 
        className="absolute left-0 right-0 h-[2px] bg-cyan-400/30 shadow-[0_0_10px_#22d3ee] pointer-events-none z-10"
        style={{ top: `${scanlineY}%` }}
      />

      {/* Main Panel Content */}
      <div className="relative z-20 flex flex-col items-center max-w-[90%] md:max-w-[650px]">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ startFrame: 5, type: "spring", damping: 10 }}
          className="mb-4"
        >
          <div 
            className="w-11 h-11 rounded-lg bg-pink-500/10 cyber-neon-border flex items-center justify-center"
            style={{ opacity: warnOpacity }}
          >
            <ShieldAlert className="w-5.5 h-5.5 text-pink-400" />
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 14 }}
          className="cyber-neon-text-pink text-xs uppercase tracking-[0.4em] mb-2.5 font-bold"
        >
          // {headerBadge}
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ startFrame: 15, type: "spring", damping: 12 }}
          className="cyber-neon-text-cyan tracking-wide uppercase font-black"
          style={{
            fontSize: isVertical ? "28px" : "44px",
            lineHeight: 1.15
          }}
        >
          {title}
        </MotionDiv>

        {statusMsg && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ startFrame: 22, type: "spring", damping: 16 }}
            className="text-cyan-300 font-sans text-xs tracking-wider max-w-[520px] mt-5 leading-relaxed font-light border-l border-cyan-500/35 pl-4 text-left"
          >
            <div className="text-[9px] text-[#f472b6] font-mono tracking-widest font-bold uppercase mb-1">
              STATUS: {warningLabel}
            </div>
            {statusMsg}
          </MotionDiv>
        )}

        <MotionDiv
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ startFrame: 28, type: "spring", damping: 15 }}
          className="w-48 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-pink-500 mt-8"
        />
      </div>
    </div>
  );
};
