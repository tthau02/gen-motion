import React from "react";
import { Img } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Layers, Database, ArrowRight, Cpu, Play } from "lucide-react";
import { MotionDiv } from "../components/Motion";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", {
  weights: ["400", "700"],
});

interface SceneScaleProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
}

export const SceneScale: React.FC<SceneScaleProps> = ({
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
      <div className="w-[45%] h-[280px] relative flex items-center justify-center">
        {/* Source JSON Box */}
        <MotionDiv
          initial={{ opacity: 0, x: -40, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ startFrame: 15, type: "spring", damping: 12 }}
          className="absolute left-1 w-24 h-24 rounded bg-vintage-bg border border-vintage-border/50 shadow-lg p-3 flex flex-col justify-between"
        >
          <Database className="w-5 h-5 text-vintage-gold" />
          <div className="font-mono text-[7px] text-vintage-muted leading-tight">
            {"{"}
            <br />
            &nbsp;&nbsp;"id": 9812,
            <br />
            &nbsp;&nbsp;"title": "Remo"
            <br />
            {"}"}
          </div>
          <span className="text-[7px] text-vintage-muted tracking-wider uppercase font-bold">
            JSON
          </span>
        </MotionDiv>

        {/* Action arrow */}
        <div className="flex items-center gap-1.5 z-10">
          <ArrowRight className="w-5 h-5 text-vintage-gold animate-pulse" />
        </div>

        {/* Server Render Box */}
        <MotionDiv
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ startFrame: 25, type: "spring", damping: 13 }}
          className="absolute w-28 h-28 rounded bg-vintage-bg border border-vintage-gold/50 shadow-2xl p-3 flex flex-col justify-between items-center text-center z-20"
        >
          <Cpu className="w-7 h-7 text-vintage-gold animate-pulse" />
          <span className="text-[9px] text-vintage-paper font-sans font-bold">
            AWS Lambda
          </span>
          <span className="text-[6px] text-vintage-muted uppercase tracking-widest font-mono">
            Render Engine
          </span>
        </MotionDiv>

        {/* Output Video Box */}
        <MotionDiv
          initial={{ opacity: 0, x: 40, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ startFrame: 35, type: "spring", damping: 12 }}
          className="absolute right-1 w-24 h-24 rounded bg-vintage-bg border border-vintage-border/50 shadow-lg p-3 flex flex-col justify-between"
        >
          <div className="w-full h-10 rounded bg-vintage-border/20 flex items-center justify-center">
            <Play className="w-4 h-4 text-vintage-gold" />
          </div>
          <span className="text-[8px] text-vintage-paper font-bold font-mono text-center">
            video.mp4
          </span>
        </MotionDiv>
      </div>
      <div className="w-[55%] flex flex-col justify-center">
        <MotionDiv
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 15 }}
          className="flex items-center gap-2 mb-3"
        >
          <Layers className="w-4 h-4 text-vintage-gold" />
          <span
            className="text-vintage-gold font-sans text-xs tracking-widest uppercase font-bold"
            style={{ fontFamily: sansFont }}
          >
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
        <span
          className="text-[10px] text-vintage-muted"
          style={{ fontFamily: sansFont }}
        >
          Dynamic Content &bull; Scalable Pipelines &bull; Automation
        </span>
      </div>
    </div>
  );
};
