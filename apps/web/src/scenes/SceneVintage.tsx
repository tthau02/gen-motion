import React from "react";
import { Img, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Camera } from "lucide-react";
import { MotionDiv } from "../components/Motion";
import "./styles/SceneVintage.css";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface SceneVintageProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  customProps?: {
    badgeText?: string;
    [key: string]: unknown;
  };
}

export const SceneVintage: React.FC<SceneVintageProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  customProps = {},
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const headerBadge = customProps?.badgeText || subtitle;

  // Background slow zoom
  const bgScale = interpolate(frame, [0, 300], [1.08, 1.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typewriter effect for description (typing 1 char every 2 frames)
  const typingStartFrame = 24;
  const typedLength = description 
    ? Math.min(description.length, Math.floor(Math.max(0, frame - typingStartFrame) * 0.8))
    : 0;
  const typedText = description ? description.substring(0, typedLength) : "";
  const isTypingComplete = description ? typedLength >= description.length : true;

  // Deterministic Old-Film Jitter & Flicker
  const jitterX = Math.sin(frame * 1.5) * Math.cos(frame * 2.7) * 1.2;
  const jitterY = Math.cos(frame * 1.9) * Math.sin(frame * 3.1) * 1.2;
  
  // Random-like dust particles coordinates
  const dustX = interpolate((Math.sin(frame * 4.3) + 1) / 2, [0, 1], [40, isVertical ? 320 : 960]);
  const dustY = interpolate((Math.cos(frame * 3.1) + 1) / 2, [0, 1], [40, isVertical ? 600 : 680]);
  const showDust = (frame % 7 === 0 || frame % 11 === 0);

  // General vintage brightness flicker
  const flickerOpacity = interpolate(Math.sin(frame * 0.9), [-1, 1], [0.03, 0.08]);

  return (
    <div 
      className="relative flex flex-col items-center justify-center h-full w-full vintage-container select-none p-6 md:p-12 text-center"
      style={{ 
        fontFamily: sansFont,
        transform: `translate(${jitterX}px, ${jitterY}px)`
      }}
    >
      {/* Cinematic LUTS & Vignettes */}
      <div className="vintage-vignette" />
      <div className="vintage-lut-tint" style={{ backgroundColor: `rgba(217, 119, 6, ${flickerOpacity})` }} />
      <div className="vintage-frame-lines" style={{ inset: isVertical ? "16px" : "30px" }} />

      {/* Jittery Dust Particle Simulation */}
      {showDust && (
        <div 
          className="vintage-dust"
          style={{
            left: `${dustX}px`,
            top: `${dustY}px`,
            transform: `rotate(${frame * 45}deg)`,
            width: `${1 + (frame % 3)}px`,
            height: `${8 + (frame % 8)}px`,
          }}
        />
      )}

      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover filter grayscale-[40%] sepia-[25%]"
            style={{
              transform: `scale(${bgScale})`,
            }}
          />
        </div>
      )}

      {/* Main Content */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ startFrame: 6, type: "spring", damping: 20 }}
        className="mb-4 text-vintage-gold/80 z-20"
      >
        <Camera className="w-8 h-8" />
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.75, y: 0 }}
        transition={{ startFrame: 12, type: "tween", duration: 30 }}
        className="text-vintage-gold text-xs uppercase tracking-[0.4em] mb-4 font-semibold z-20"
      >
        {headerBadge}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ startFrame: 16, type: "spring", damping: 16 }}
        className="text-[#f5ebd7] tracking-widest uppercase text-center max-w-[800px] font-medium z-20 leading-tight"
        style={{ 
          fontFamily: serifFont,
          fontSize: isVertical ? "30px" : "46px"
        }}
      >
        {title}
      </MotionDiv>

      {description && (
        <MotionDiv
          className="text-[#e2d5c3] text-xs tracking-wider text-center mt-6 leading-relaxed font-light z-20 italic font-serif h-12"
          style={{ 
            fontFamily: serifFont,
            maxWidth: isVertical ? "90%" : "460px",
          }}
        >
          {typedText && `"${typedText}"`}
          {!isTypingComplete && frame >= typingStartFrame && (
            <span className="inline-block w-1.5 h-3.5 bg-vintage-gold ml-1.5 align-middle opacity-80" />
          )}
        </MotionDiv>
      )}

      {/* Separator Dots */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ startFrame: 30, type: "spring", damping: 18 }}
        className="flex items-center gap-1.5 mt-8 z-20"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-vintage-gold" />
        <div className="w-1.5 h-1.5 rounded-full bg-vintage-gold" />
        <div className="w-1.5 h-1.5 rounded-full bg-vintage-gold" />
      </MotionDiv>
    </div>
  );
};
