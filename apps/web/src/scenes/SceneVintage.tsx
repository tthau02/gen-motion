import React from "react";
import { Img } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Camera } from "lucide-react";
import { MotionDiv } from "../components/Motion";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface SceneVintageProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
}

export const SceneVintage: React.FC<SceneVintageProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
}) => {
  return (
    <div 
      className="relative flex flex-col items-center justify-center h-full w-full bg-[#1c1815] overflow-hidden select-none"
      style={{ fontFamily: sansFont }}
    >
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-10 vignette-overlay opacity-80" />
      <div className="absolute inset-0 z-10 cinematic-tint" />

      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover opacity-25 scale-[1.08] animate-subtle-drift filter grayscale-[30%] sepia-[15%]"
          />
        </div>
      )}

      {/* Retro parchment paper texture border */}
      <div className="absolute inset-8 border border-vintage-gold/25 pointer-events-none -z-10 rounded-sm" />

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
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ startFrame: 12, type: "tween", duration: 30 }}
        className="text-vintage-gold text-xs uppercase tracking-[0.4em] mb-3 font-semibold z-20"
      >
        {subtitle}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ startFrame: 16, type: "spring", damping: 16 }}
        className="text-[#f5ebd7] text-4xl md:text-5xl tracking-widest uppercase text-center max-w-[800px] font-medium z-20"
        style={{ fontFamily: serifFont }}
      >
        {title}
      </MotionDiv>

      {description && (
        <MotionDiv
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ startFrame: 24, type: "tween", duration: 25 }}
          className="text-[#e2d5c3] text-xs tracking-wider text-center max-w-[460px] mt-5 leading-relaxed font-light z-20 italic font-serif"
          style={{ fontFamily: serifFont }}
        >
          "{description}"
        </MotionDiv>
      )}

      {/* Elegant gold dots separator */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ startFrame: 30, type: "spring", damping: 18 }}
        className="flex items-center gap-1.5 mt-6 z-20"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-vintage-gold" />
        <div className="w-1.5 h-1.5 rounded-full bg-vintage-gold" />
        <div className="w-1.5 h-1.5 rounded-full bg-vintage-gold" />
      </MotionDiv>
    </div>
  );
};
