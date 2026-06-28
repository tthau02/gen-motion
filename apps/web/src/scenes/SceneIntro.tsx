import React from "react";
import { Img, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { BookOpen, Code2, HeartHandshake, Landmark, Mic2, Sparkles } from "lucide-react";
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
    layoutVariant?: "center" | "split" | "spotlight" | "dashboard";
    visualStyle?: "cinematic" | "minimal" | "technical" | "bold";
    shotType?: string;
    focalPoint?: string;
    [key: string]: unknown;
  };
}

const resolveIntroIcon = (visualStyle?: string, shotType?: string) => {
  if (visualStyle === "technical") return Code2;
  if (shotType === "documentary") return BookOpen;
  if (shotType === "editorial") return Landmark;
  if (shotType === "close-up") return HeartHandshake;
  if (shotType === "data-insert") return Mic2;
  return Sparkles;
};

export const SceneIntro: React.FC<SceneIntroProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  customProps = {},
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const {
    badgeText,
    focalPoint,
    layoutVariant = "center",
    shotType,
    visualStyle = "cinematic",
  } = customProps;
  const Icon = resolveIntroIcon(visualStyle, shotType);
  const isSplit = layoutVariant === "split" && !isVertical;
  const isMinimal = visualStyle === "minimal";
  const isTechnical = visualStyle === "technical" || layoutVariant === "dashboard";
  const alignClass = isSplit ? "items-start text-left" : "items-center text-center";
  const iconLabel = badgeText || focalPoint || subtitle;

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

  // Icon rotation and scale animation
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

      <div
        className="intro-vignette"
        style={{
          background: isSplit
            ? "linear-gradient(90deg, rgba(0,0,0,0.86), rgba(0,0,0,0.42), rgba(0,0,0,0.18))"
            : undefined,
        }}
      />
      
      {!isMinimal && (
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
      )}

      <div
        className={`relative flex flex-col justify-center h-full w-full p-8 md:p-12 ${alignClass}`}
        style={{
          paddingLeft: isSplit ? "7%" : undefined,
          maxWidth: isSplit ? "58%" : undefined,
        }}
      >
        <MotionDiv
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ startFrame: 5, type: "spring", damping: 12 }}
          className="mb-5 flex items-center gap-3"
          style={{
            transform: `scale(${sparkleScale}) rotate(${isTechnical ? 0 : sparkleRotation}deg)`,
          }}
        >
          <Icon className="w-12 h-12 text-vintage-gold drop-shadow-[0_0_12px_rgba(200,149,71,0.5)]" />
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
          {iconLabel}
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ startFrame: 15, type: "spring", damping: 14 }}
          className={`text-vintage-paper font-serif font-bold leading-tight ${
            isTechnical || visualStyle === "bold" ? "tracking-widest uppercase" : "tracking-wide"
          }`}
          style={{ 
            fontFamily: serifFont,
            fontSize: isVertical ? "32px" : "56px",
            maxWidth: isVertical ? "90%" : "850px",
          }}
        >
          {title}
        </MotionDiv>

        {(description || subtitle) && (
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
            {description || subtitle}
          </MotionDiv>
        )}

        {!isMinimal && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ startFrame: 28, type: "spring", damping: 18 }}
            className="w-24 h-[1px] bg-vintage-gold mt-8"
          />
        )}
      </div>
    </div>
  );
};
