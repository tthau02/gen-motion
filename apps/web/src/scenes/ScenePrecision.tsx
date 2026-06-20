import React from "react";
import { Img, useCurrentFrame, interpolate } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Camera, Play } from "lucide-react";
import { MotionDiv } from "../components/Motion";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface ScenePrecisionProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
}

export const ScenePrecision: React.FC<ScenePrecisionProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
}) => {
  const frame = useCurrentFrame();
  const playheadX = interpolate(frame % 30, [0, 29], [10, 95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div className="relative flex flex-row-reverse items-center justify-between w-full h-full max-w-[1050px] px-12 gap-12">
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover opacity-10 scale-[1.08] animate-subtle-drift"
          />
        </div>
      )}

      <div className="w-[45%] h-[280px] relative rounded-lg overflow-hidden border border-vintage-border/40 bg-vintage-bg/90 shadow-2xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-vintage-muted font-mono tracking-widest uppercase">Trình Giám Sát Timeline</span>
          <span className="text-[9px] text-vintage-gold font-mono">FRAME: {frame}</span>
        </div>

        <div className="flex-1 my-4 flex flex-col gap-2.5 justify-center">
          <div className="h-7 rounded bg-vintage-border/20 border border-vintage-border/30 flex items-center px-3 justify-between">
            <span className="text-[8px] text-vintage-muted font-mono uppercase">Audio Layer</span>
            <div className="flex gap-[2px] items-center">
              {[6, 12, 20, 14, 10, 12, 22, 16, 8, 12, 18, 10, 6].map((h, i) => (
                <div key={i} className="w-[2px] bg-vintage-muted/50 rounded" style={{ height: `${h}px` }} />
              ))}
            </div>
          </div>
          <div className="h-7 rounded bg-vintage-gold/15 border border-vintage-gold/30 flex items-center px-3 justify-between">
            <span className="text-[8px] text-vintage-gold font-mono uppercase font-bold">Video Track</span>
            <Play className="w-2.5 h-2.5 text-vintage-gold" />
          </div>
        </div>

        <div className="h-8 border-t border-vintage-border/40 pt-1 relative">
          <div className="w-full h-1 bg-vintage-border/30 rounded-full relative" />
          <div className="absolute top-0.5 w-[2px] h-3 bg-vintage-gold" style={{ left: `${playheadX}%` }} />
          <div className="flex justify-between text-[7px] text-vintage-muted font-mono mt-2">
            <span>00s</span>
            <span>10s</span>
            <span>20s</span>
            <span>30s</span>
          </div>
        </div>
      </div>

      <div className="w-[55%] flex flex-col justify-center">
        <MotionDiv
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 15 }}
          className="flex items-center gap-2 mb-3"
        >
          <Camera className="w-4 h-4 text-vintage-gold" />
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
          Frame-Accurate &bull; Determinisitic Rendering
        </span>
      </div>
    </div>
  );
};
