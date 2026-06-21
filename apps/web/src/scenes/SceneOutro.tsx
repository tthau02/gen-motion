import React from "react";
import { Img, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/FiraCode";
import { Sparkles, Terminal, ChevronRight } from "lucide-react";
import { MotionDiv } from "../components/Motion";
import "./styles/SceneOutro.css";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });
const { fontFamily: monoFont } = loadMono("normal", { weights: ["400"] });

interface SceneOutroProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  customProps?: {
    badgeText?: string;
    terminalCommand?: string;
    chips?: string[];
    [key: string]: unknown;
  };
}

export const SceneOutro: React.FC<SceneOutroProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  customProps = {},
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;

  const terminalCommand = customProps?.terminalCommand || "npx create-video@latest";
  const headerBadge = customProps?.badgeText || "Installation Console";
  
  const stepLog1 = customProps?.chips?.[0] || "Fetching templates and assets...";
  const stepLog2 = customProps?.chips?.[1] || "Bundling media configurations... Done.";
  const stepLog3 = customProps?.chips?.[2] || "Setup completed! Type 'npm run dev' to launch.";

  // Background drift
  const bgScale = interpolate(frame, [0, 300], [1.05, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sparkles spin
  const sparkleRotation = interpolate(frame, [0, 300], [0, 60]);

  // Terminal command typing
  const startTypingFrame = 15;
  const commandTypedLength = Math.min(
    terminalCommand.length,
    Math.floor(Math.max(0, frame - startTypingFrame) * 1.5)
  );
  const displayCommand = terminalCommand.substring(0, commandTypedLength);

  // Status logs showing step-by-step
  const showLog1 = frame > 45;
  const showLog2 = frame > 65;
  const showLog3 = frame > 85;

  // Spring animations for the final CTA button
  const buttonSpring = spring({
    frame: Math.max(0, frame - 95),
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 140 },
  });

  // Installation Progress Bar animation
  const progressBarPercent = interpolate(frame, [45, 85], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div className="outro-container flex flex-col items-center justify-center h-full w-full p-6 md:p-12 text-center">
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover opacity-15"
            style={{
              transform: `scale(${bgScale})`,
            }}
          />
        </div>
      )}

      {/* Rotating Badge Logo */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.4, rotate: 90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ startFrame: 5, type: "spring", damping: 14 }}
        className="mb-5"
      >
        <div 
          className="w-14 h-14 rounded-full border border-vintage-gold/40 flex items-center justify-center bg-black/60 drop-shadow-[0_0_12px_rgba(200,149,71,0.3)]"
          style={{ transform: `rotate(${sparkleRotation}deg)` }}
        >
          <Sparkles className="w-6 h-6 text-vintage-gold" />
        </div>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ startFrame: 10, type: "spring", damping: 16 }}
        className="text-vintage-muted font-sans text-xs tracking-[0.25em] uppercase mb-3"
        style={{ fontFamily: sansFont }}
      >
        {subtitle}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ startFrame: 15, type: "spring", damping: 13 }}
        className="text-vintage-paper font-serif tracking-wide uppercase font-bold"
        style={{ 
          fontFamily: serifFont,
          fontSize: isVertical ? "32px" : "52px",
          maxWidth: isVertical ? "90%" : "850px",
          lineHeight: 1.15
        }}
      >
        {title}
      </MotionDiv>

      {/* Outro Terminal Mockup with Step Logs */}
      <MotionDiv
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ startFrame: 22, type: "spring", damping: 15 }}
        className={`mt-6 outro-terminal rounded border text-left flex flex-col gap-2 font-mono text-[9px] md:text-[10px] ${
          isVertical ? "w-full p-3.5" : "max-w-[420px] w-full p-4.5"
        }`}
        style={{ fontFamily: monoFont }}
      >
        <div className="flex items-center gap-1.5 text-slate-500 border-b border-white/5 pb-1.5 mb-1 justify-between">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/30" />
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/30" />
          </div>
          <span className="text-[8px] tracking-wider uppercase font-bold text-slate-600">
            {headerBadge}
          </span>
        </div>

        <div className="flex gap-2">
          <Terminal className="w-3.5 h-3.5 text-vintage-gold shrink-0 mt-0.5" />
          <span className="text-[#a88653] truncate">
            {displayCommand}
            {frame < 45 && <span className="code-cursor" />}
          </span>
        </div>

        {showLog1 && (
          <div className="text-slate-400 pl-5 truncate">
            ➜ {stepLog1}
          </div>
        )}

        {showLog2 && (
          <div className="text-slate-400 pl-5">
            <span className="block truncate">➜ {stepLog2}</span>
            <div className="w-full h-1 bg-slate-900 rounded overflow-hidden mt-1.5 relative border border-white/5">
              <div 
                className="h-full bg-vintage-gold" 
                style={{ width: `${progressBarPercent}%` }}
              />
            </div>
          </div>
        )}

        {showLog3 && (
          <div className="text-[#bef264] font-bold pl-5 truncate">
            ✔ {stepLog3}
          </div>
        )}
      </MotionDiv>

      {/* Dynamic CTA Spring Button */}
      <MotionDiv
        style={{
          transform: `scale(${buttonSpring})`,
          opacity: buttonSpring,
        }}
        className="mt-8"
      >
        <div className="outro-button px-6 py-2.5 rounded-full flex items-center gap-2 cursor-pointer text-xs">
          <span>Khám phá ngay</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </MotionDiv>

      {description && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ startFrame: 30, type: "tween", duration: 20 }}
          className="text-[9px] text-vintage-muted uppercase mt-6 tracking-widest font-mono"
          style={{ fontFamily: sansFont }}
        >
          {description}
        </MotionDiv>
      )}
    </div>
  );
};
