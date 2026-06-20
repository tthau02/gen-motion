import React from "react";
import { Img } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Sparkles, Terminal } from "lucide-react";
import { MotionDiv } from "../components/Motion";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface SceneOutroProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  terminalCommand?: string;
}

export const SceneOutro: React.FC<SceneOutroProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  terminalCommand = "npx create-video@latest",
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full">
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover opacity-15 scale-[1.08] animate-subtle-drift"
          />
        </div>
      )}

      <MotionDiv
        initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ startFrame: 5, type: "spring", damping: 14 }}
        className="mb-5"
      >
        <div className="w-14 h-14 rounded-full border border-vintage-gold/50 flex items-center justify-center bg-vintage-bg/80 drop-shadow-[0_0_12px_rgba(200,149,71,0.3)]">
          <Sparkles className="w-7 h-7 text-vintage-gold" />
        </div>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 12 }}
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
        className="text-vintage-paper font-serif text-5xl md:text-6xl tracking-wide uppercase text-center max-w-[850px] font-bold"
        style={{ fontFamily: serifFont }}
      >
        {title}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ startFrame: 22, type: "spring", damping: 15 }}
        className="mt-6 bg-black/80 rounded border border-vintage-border/50 px-5 py-3 flex items-center gap-4.5 shadow-xl max-w-[280px] w-full"
      >
        <Terminal className="w-4 h-4 text-vintage-gold" />
        <span className="font-mono text-xs text-vintage-paper/90 flex-1">{terminalCommand}</span>
      </MotionDiv>

      {description && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ startFrame: 30, type: "tween", duration: 20 }}
          className="text-[9px] text-vintage-muted uppercase mt-5 tracking-widest font-mono"
          style={{ fontFamily: sansFont }}
        >
          {description}
        </MotionDiv>
      )}
    </div>
  );
};
