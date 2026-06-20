import React from "react";
import { Img } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Sparkles } from "lucide-react";
import { MotionDiv } from "../components/Motion";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface SceneIntroProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
}

export const SceneIntro: React.FC<SceneIntroProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full">
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover opacity-20 scale-[1.08] animate-subtle-drift"
          />
        </div>
      )}

      <MotionDiv
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ startFrame: 5, type: "spring", damping: 12 }}
        className="mb-5"
      >
        <Sparkles className="w-12 h-12 text-vintage-gold drop-shadow-[0_0_12px_rgba(200,149,71,0.4)]" />
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ startFrame: 10, type: "spring", damping: 16 }}
        className="text-vintage-muted font-sans text-xs tracking-[0.3em] uppercase mb-3"
        style={{ fontFamily: sansFont }}
      >
        {subtitle}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ startFrame: 15, type: "spring", damping: 14 }}
        className="text-vintage-paper font-serif text-6xl md:text-7xl tracking-widest uppercase text-center max-w-[850px] font-bold"
        style={{ fontFamily: serifFont }}
      >
        {title}
      </MotionDiv>

      {description && (
        <MotionDiv
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ startFrame: 22, type: "spring", damping: 16 }}
          className="text-vintage-paper font-sans text-sm tracking-wide text-center max-w-[500px] mt-4 font-light"
          style={{ fontFamily: sansFont }}
        >
          {description}
        </MotionDiv>
      )}

      <MotionDiv
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ startFrame: 28, type: "spring", damping: 18 }}
        className="w-24 h-[1px] bg-vintage-gold mt-6"
      />
    </div>
  );
};
