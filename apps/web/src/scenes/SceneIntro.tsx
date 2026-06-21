import React from "react";
import { Img, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Sparkles } from "lucide-react";
import { MotionDiv } from "../components/Motion";
import "./styles/SceneIntro.css";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface SceneIntroProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  customProps?: {
    badgeText?: string;
    [key: string]: unknown;
  };
}

export const SceneIntro: React.FC<SceneIntroProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  // Frame-locked background drift animation
  const bgScale = interpolate(frame, [0, 300], [1.05, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgTranslateX = interpolate(frame, [0, 300], [0, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgTranslateY = interpolate(frame, [0, 300], [0, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sparkle rotation and glow animation
  const sparkleRotation = interpolate(frame, [0, 300], [0, 120]);
  const sparkleScale = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.9, 1.15]
  );

  // Border line expansion width & height animation
  const borderProgress = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div className="intro-container w-full h-full">
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover opacity-20"
            style={{
              transform: `scale(${bgScale}) translate(${bgTranslateX}px, ${bgTranslateY}px)`,
            }}
          />
        </div>
      )}

      {/* Cinematic Overlays */}
      <div className="intro-vignette" />
      
      {/* Animated Frame Borders */}
      <div 
        className="intro-border-frame"
        style={{
          inset: isVertical ? "24px" : "40px",
          clipPath: `polygon(
            0% 0%, 
            ${borderProgress * 100}% 0%, 
            ${borderProgress * 100}% ${borderProgress * 100}%, 
            0% ${borderProgress * 100}%
          )`,
          opacity: borderProgress,
        }}
      />

      <div className="relative flex flex-col items-center justify-center h-full w-full p-8 md:p-12 text-center">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ startFrame: 5, type: "spring", damping: 12 }}
          className="mb-5"
          style={{
            transform: `scale(${sparkleScale}) rotate(${sparkleRotation}deg)`,
          }}
        >
          <Sparkles className="w-12 h-12 text-vintage-gold drop-shadow-[0_0_12px_rgba(200,149,71,0.5)]" />
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 16 }}
          className="text-vintage-muted font-sans tracking-[0.3em] uppercase mb-4"
          style={{ 
            fontFamily: sansFont,
            fontSize: isVertical ? "10px" : "12px",
          }}
        >
          {subtitle}
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ startFrame: 15, type: "spring", damping: 14 }}
          className="text-vintage-paper font-serif tracking-widest uppercase font-bold leading-tight"
          style={{ 
            fontFamily: serifFont,
            fontSize: isVertical ? "32px" : "56px",
            maxWidth: isVertical ? "90%" : "850px",
          }}
        >
          {title}
        </MotionDiv>

        {description && (
          <MotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ startFrame: 22, type: "spring", damping: 16 }}
            className="text-vintage-paper font-sans tracking-wide mt-6 font-light leading-relaxed"
            style={{ 
              fontFamily: sansFont,
              fontSize: isVertical ? "11px" : "14px",
              maxWidth: isVertical ? "90%" : "550px",
            }}
          >
            {description}
          </MotionDiv>
        )}

        <MotionDiv
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ startFrame: 28, type: "spring", damping: 18 }}
          className="w-24 h-[1px] bg-vintage-gold mt-8"
        />
      </div>
    </div>
  );
};
