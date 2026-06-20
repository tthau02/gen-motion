import React from "react";
import { Img } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Briefcase } from "lucide-react";
import { MotionDiv } from "../components/Motion";

const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface SceneCorporateProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
}

export const SceneCorporate: React.FC<SceneCorporateProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
}) => {
  return (
    <div 
      className="relative flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-[#0f172a] to-[#020617] overflow-hidden select-none"
      style={{ fontFamily: sansFont }}
    >
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden opacity-10">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover scale-[1.04] animate-subtle-drift"
          />
        </div>
      )}

      {/* Decorative corporate graph-like accent grid */}
      <div 
        className="absolute inset-x-0 bottom-0 h-48 opacity-10 pointer-events-none -z-10"
        style={{
          backgroundImage: "radial-gradient(circle, #38bdf8 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div className="border border-sky-500/25 bg-sky-950/20 backdrop-blur-sm rounded-xl p-8 max-w-[720px] w-[90%] shadow-xl flex flex-col items-center text-center">
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ startFrame: 5, type: "spring", damping: 18 }}
          className="mb-4"
        >
          <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ startFrame: 10, type: "tween", duration: 25 }}
          className="text-sky-400 text-[10px] uppercase tracking-[0.35em] font-bold mb-3"
        >
          {subtitle}
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ startFrame: 14, type: "spring", damping: 15 }}
          className="text-white text-3xl md:text-4xl tracking-tight font-extrabold uppercase"
        >
          {title}
        </MotionDiv>

        {description && (
          <MotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.75, y: 0 }}
            transition={{ startFrame: 20, type: "tween", duration: 30 }}
            className="text-slate-300 text-xs tracking-wide mt-4 max-w-[480px] leading-relaxed font-light"
          >
            {description}
          </MotionDiv>
        )}

        <MotionDiv
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ startFrame: 26, type: "spring", damping: 16 }}
          className="w-16 h-[2px] bg-sky-400 mt-6"
        />
      </div>
    </div>
  );
};
