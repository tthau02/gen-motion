import React from "react";
import { Img, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Sliders, Focus } from "lucide-react";
import { MotionDiv } from "../components/Motion";
import "./styles/SceneTransitions.css";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface SceneTransitionsProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  customProps?: {
    badgeText?: string;
    metricLabel?: string;
    metricValue?: string;
    chips?: string[];
    [key: string]: unknown;
  };
}

export const SceneTransitions: React.FC<SceneTransitionsProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  customProps = {},
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const headerBadge = customProps?.badgeText || "LUT Grading Wipe";
  const labelA = customProps?.chips?.[0] || "ORIGINAL";
  const labelB = customProps?.chips?.[1] || "CINEMATIC LUT";
  const footerLabel = customProps?.metricLabel
    ? `${customProps.metricLabel.toUpperCase()}: ${customProps.metricValue || "ON"}`
    : "Transition: Crosswipe • Easing: Bezier";

  // Background slow zoom-in/drift
  const bgScale = interpolate(frame, [0, 300], [1.03, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgTranslateX = interpolate(frame, [0, 300], [0, -8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate the sliding comparison line X position (0% to 100%) in a 70 frame loop
  const cycleFrame = frame % 70;
  const splitProgress = interpolate(
    Math.sin((cycleFrame / 70) * Math.PI * 2),
    [-1, 1],
    [15, 85]
  );

  return (
    <div
      className={`transitions-container flex items-center w-full h-full ${isVertical ? "flex-col justify-center p-6 gap-6" : "flex-row justify-between px-12 gap-12"
        }`}
    >
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover opacity-15"
            style={{
              transform: `scale(${bgScale}) translateX(${bgTranslateX}px)`,
            }}
          />
        </div>
      )}

      {/* Cinematic Letterbox Overlays */}
      <div className="cinematic-letterbox-top" style={{ height: isVertical ? "16px" : "24px" }} />
      <div className="cinematic-letterbox-bottom" style={{ height: isVertical ? "16px" : "24px" }} />

      {/* Visual Transition Swipe Comparison Mockup */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95, y: isVertical ? 20 : -25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ startFrame: 5, type: "spring", damping: 15 }}
        className={`relative rounded-lg overflow-hidden transitions-card p-4 flex flex-col justify-between ${isVertical ? "w-full h-[220px]" : "w-[45%] h-[300px]"
          }`}
      >
        <div className="flex justify-between items-center border-b border-lime-500/10 pb-2">
          <span className="text-[9px] text-[#bef264] font-mono tracking-widest uppercase">
            {headerBadge}
          </span>
          <Focus className="w-4 h-4 text-[#bef264]" />
        </div>

        {/* Viewport comparing original vs graded */}
        <div className="flex-1 my-3 border border-white/5 rounded relative overflow-hidden flex items-center justify-center">
          {/* Side A (Original Rec709 Look) */}
          <div className="absolute inset-0 bg-[#151b11] flex items-center justify-center text-left">
            <span className="text-[8px] text-slate-500 font-mono tracking-wider absolute left-3 bottom-3">
              {labelA}
            </span>
          </div>

          {/* Side B (Warm Cinematic Grade) */}
          <div
            className="absolute inset-y-0 right-0 bg-[#251f15] border-l border-amber-400 transitions-split-line flex items-center justify-center"
            style={{ left: `${splitProgress}%` }}
          >
            <span className="text-[8px] text-amber-400 font-mono tracking-wider absolute right-3 bottom-3 truncate max-w-[80px]">
              {labelB}
            </span>
          </div>
        </div>

        <div className="text-center text-[8px] text-amber-400/80 font-mono tracking-widest uppercase truncate">
          {footerLabel}
        </div>
      </MotionDiv>

      {/* Info Pane */}
      <div className={`flex flex-col justify-center ${isVertical ? "w-full text-center items-center" : "w-[55%]"}`}>
        <MotionDiv
          initial={{ opacity: 0, x: isVertical ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 15 }}
          className="flex items-center gap-2 mb-3"
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span
            className="text-amber-400 font-sans text-xs tracking-widest uppercase font-bold"
            style={{ fontFamily: sansFont }}
          >
            {subtitle}
          </span>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ startFrame: 16, type: "spring", damping: 14 }}
          className="text-white font-serif tracking-widest uppercase font-bold leading-tight mb-4"
          style={{
            fontFamily: serifFont,
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
          Slide Swipe Transitions &bull; Light Leaks Overlay &bull; Film Look
        </span>
      </div>
    </div>
  );
};
