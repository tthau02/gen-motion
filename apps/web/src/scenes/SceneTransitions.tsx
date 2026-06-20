import React from "react";
import { Img, useCurrentFrame, interpolate } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Sliders } from "lucide-react";
import { MotionDiv } from "../components/Motion";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface SceneTransitionsProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
}

export const SceneTransitions: React.FC<SceneTransitionsProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
}) => {
  const frame = useCurrentFrame();
  const swipeX = interpolate(frame % 40, [0, 39], [-100, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div className="relative flex flex-row items-center justify-between w-full h-full max-w-[1050px] px-12 gap-12">
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover opacity-10 scale-[1.08] animate-subtle-drift"
          />
        </div>
      )}

      {/* Visual Transition representation */}
      <div className="w-[45%] h-[280px] relative rounded-lg overflow-hidden border border-vintage-border/40 bg-vintage-bg/90 shadow-2xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center border-b border-vintage-border/30 pb-2">
          <span className="text-[9px] text-vintage-muted font-mono tracking-widest uppercase">Thử Nghiệm Chuyển Cảnh</span>
          <Sliders className="w-4 h-4 text-vintage-gold" />
        </div>

        {/* Swipe demo viewport */}
        <div className="flex-1 my-4 border border-vintage-border/20 rounded relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-vintage-rust/10 flex items-center justify-center">
            <span className="text-[10px] text-vintage-paper font-serif italic">Scene A</span>
          </div>

          <div
            className="absolute inset-0 bg-vintage-gold/20 flex items-center justify-center border-l border-vintage-gold"
            style={{ transform: `translateX(${100 + swipeX}%)` }}
          >
            <span className="text-[10px] text-vintage-paper font-serif italic">Scene B</span>
          </div>
        </div>

        <div className="text-center text-[8px] text-vintage-gold font-mono tracking-widest animate-pulse">
          EFFECT: SLIDE WIPE PREVIEW
        </div>
      </div>

      <div className="w-[55%] flex flex-col justify-center">
        <MotionDiv
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 15 }}
          className="flex items-center gap-2 mb-3"
        >
          <Sliders className="w-4 h-4 text-vintage-gold" />
          <span className="text-vintage-gold font-sans text-xs tracking-widest uppercase font-bold" style={{ fontFamily: sansFont }}>
            {subtitle}
          </span>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ startFrame: 16, type: "spring", damping: 14 }}
          className="text-vintage-paper font-serif text-3xl md:text-4xl leading-tight mb-4 font-bold"
          style={{ fontFamily: serifFont }}
        >
          {title}
        </MotionDiv>

        {description && (
          <MotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ startFrame: 22, type: "spring", damping: 16 }}
            className="text-vintage-paper font-sans text-xs md:text-sm leading-relaxed mb-4 font-light"
            style={{ fontFamily: sansFont }}
          >
            {description}
          </MotionDiv>
        )}

        <div className="w-full h-[1px] bg-vintage-border/30 my-3" />
        <span className="text-[10px] text-vintage-muted" style={{ fontFamily: sansFont }}>
          Transitions &bull; Filters &bull; Overlays &bull; Light Leaks
        </span>
      </div>
    </div>
  );
};
