import React from "react";
import { Img, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadMono } from "@remotion/google-fonts/ShareTechMono";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Camera, Clock } from "lucide-react";
import { MotionDiv } from "../components/Motion";
import "./styles/ScenePrecision.css";

const { fontFamily: monoFont } = loadMono("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface ScenePrecisionProps {
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

export const ScenePrecision: React.FC<ScenePrecisionProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  customProps = {},
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const headerBadge = customProps?.badgeText || "Chronometer Grid";
  const trackLabel1 = customProps?.metricLabel || "Audio Track";
  const trackLabel2 = customProps?.metricValue || "Video Track";

  // Background drift animation
  const bgScale = interpolate(frame, [0, 300], [1.04, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate timer values
  const totalSeconds = frame / 30;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const centiseconds = Math.floor((totalSeconds % 1) * 100);
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;

  // SVG circular gauge properties
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const sweepProgress = (frame % 90) / 90;
  const strokeDashoffset = circumference - sweepProgress * circumference;

  // Timeline playhead sweep animation
  const playheadX = interpolate(frame % 90, [0, 89], [12, 88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div 
      className={`precision-container flex items-center w-full h-full ${
        isVertical ? "flex-col justify-center p-6 gap-6" : "flex-row-reverse justify-between px-12 gap-12"
      }`}
    >
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover opacity-10"
            style={{
              transform: `scale(${bgScale})`,
            }}
          />
        </div>
      )}

      {/* Clock and Timeline Monitor */}
      <MotionDiv
        initial={{ opacity: 0, x: isVertical ? 0 : 30, y: isVertical ? 20 : 0, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ startFrame: 5, type: "spring", damping: 15 }}
        className={`relative rounded-lg overflow-hidden precision-card p-4 flex flex-col justify-between ${
          isVertical ? "w-full h-[220px]" : "w-[45%] h-[300px]"
        }`}
      >
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <span className="text-[9px] text-sky-400 font-mono tracking-widest uppercase">
            {headerBadge}
          </span>
          <span className="text-[9px] text-[#94a3b8] font-mono">
            FRM: {frame}
          </span>
        </div>

        {/* Circular Dial and Timer */}
        <div className="flex-1 flex items-center justify-center gap-6 my-2">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* SVG Progress Arc */}
            <svg className="absolute w-full h-full radial-progress-ring" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-800 fill-none"
                strokeWidth="3.5"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-sky-400 fill-none"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <Clock className="w-5 h-5 text-sky-400/80" />
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest mb-0.5">
              Elapsed Time
            </span>
            <span 
              className="text-xl md:text-2xl text-white font-mono font-bold tabular-nums"
              style={{ fontFamily: monoFont }}
            >
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Timeline Tracks */}
        <div className="h-16 border-t border-white/5 pt-2 relative">
          <div className="flex flex-col gap-1">
            <div className="h-4.5 rounded bg-slate-900/60 border border-white/5 flex items-center px-2 justify-between">
              <span className="text-[7px] text-slate-500 font-mono uppercase truncate max-w-[50%]">
                {trackLabel1}
              </span>
              <div className="flex gap-[2px] items-center">
                {[6, 12, 18, 14, 10, 16, 20].map((h, i) => (
                  <div key={i} className="w-[1px] bg-slate-600 rounded" style={{ height: `${h * 0.5}px` }} />
                ))}
              </div>
            </div>
            <div className="h-4.5 rounded timeline-clip-active flex items-center px-2 justify-between">
              <span className="text-[7px] text-sky-400 font-mono uppercase font-bold truncate max-w-[70%]">
                {trackLabel2}
              </span>
              <span className="text-[7px] text-sky-400/85 font-mono">100% Sync</span>
            </div>
          </div>
          
          {/* Animated Playhead indicator */}
          <div className="absolute top-2 w-[1.5px] h-10 bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" style={{ left: `${playheadX}%` }} />
        </div>
      </MotionDiv>

      {/* Info Pane */}
      <div className={`flex flex-col justify-center ${isVertical ? "w-full text-center items-center" : "w-[55%]"}`}>
        <MotionDiv
          initial={{ opacity: 0, x: isVertical ? 0 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 15 }}
          className="flex items-center gap-2 mb-3"
        >
          <Camera className="w-4 h-4 text-sky-400" />
          <span
            className="text-sky-400 font-sans text-xs tracking-widest uppercase font-bold"
            style={{ fontFamily: sansFont }}
          >
            {subtitle}
          </span>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ startFrame: 16, type: "spring", damping: 14 }}
          className="text-white font-sans font-bold tracking-tight leading-tight mb-4"
          style={{ 
            fontFamily: sansFont,
            fontSize: isVertical ? "26px" : "36px",
          }}
        >
          {title}
        </MotionDiv>

        {description && (
          <MotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ startFrame: 22, type: "spring", damping: 16 }}
            className="text-stone-300 font-sans text-xs md:text-sm leading-relaxed mb-5 font-light"
            style={{ 
              fontFamily: sansFont,
              maxWidth: isVertical ? "100%" : "95%",
            }}
          >
            {description}
          </MotionDiv>
        )}

        <div className="w-full h-[1px] bg-white/10 my-4" />
        <span
          className="text-[10px] text-stone-500 font-mono"
          style={{ fontFamily: sansFont }}
        >
          Subsecond Precision &bull; Multi-Track Audio Matching &bull; Frame-Locked
        </span>
      </div>
    </div>
  );
};
