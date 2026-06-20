import React from "react";
import { Img } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Zap } from "lucide-react";
import { MotionDiv } from "../components/Motion";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface ScenePerformanceProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
}

export const ScenePerformance: React.FC<ScenePerformanceProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
}) => {
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

      {/* Render Node visual mockup */}
      <div className="w-[45%] h-[280px] relative rounded-lg overflow-hidden border border-vintage-border/40 bg-vintage-bg/90 shadow-2xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-center border-b border-vintage-border/30 pb-2">
          <span className="text-[9px] text-vintage-muted font-mono tracking-widest uppercase">Trình Quản Trị Render Node</span>
          <Zap className="w-4 h-4 text-vintage-gold animate-pulse" />
        </div>

        {/* Server clusters */}
        <div className="flex-1 my-4 flex flex-col justify-center gap-3">
          {[1, 2, 3].map((cluster) => (
            <div key={cluster} className="h-6 rounded bg-vintage-border/20 flex items-center px-3 justify-between">
              <span className="text-[8px] text-vintage-paper font-mono uppercase">Render Thread #{cluster}</span>
              <div className="flex gap-1.5 items-center">
                <span className="text-[8px] text-vintage-gold font-mono">100% CPU</span>
                <span className="w-2 h-2 rounded-full bg-vintage-gold animate-ping" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-[8px] text-vintage-muted font-mono">
          <span>CORES: 16/16 ACTIVE</span>
          <span>SPEED: 4.8 GHz</span>
        </div>
      </div>

      <div className="w-[55%] flex flex-col justify-center">
        <MotionDiv
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 15 }}
          className="flex items-center gap-2 mb-3"
        >
          <Zap className="w-4 h-4 text-vintage-gold" />
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
          Multi-core Optimization &bull; Serverless Parallelism &bull; Fast Render
        </span>
      </div>
    </div>
  );
};
