import React from "react";
import { Img } from "remotion";
import { loadFont as loadTech } from "@remotion/google-fonts/ShareTechMono";
import { Cpu } from "lucide-react";
import { MotionDiv } from "../components/Motion";

const { fontFamily: techFont } = loadTech("normal", { weights: ["400"] });

interface SceneCyberpunkProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
}

export const SceneCyberpunk: React.FC<SceneCyberpunkProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
}) => {
  return (
    <div 
      className="relative flex flex-col items-center justify-center h-full w-full bg-[#08070b] overflow-hidden select-none"
      style={{ fontFamily: techFont }}
    >
      {/* Cyber Grid Background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none -z-10" 
        style={{
          backgroundImage: "linear-gradient(to right, #ec4899 1px, transparent 1px), linear-gradient(to bottom, #ec4899 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden opacity-15">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover scale-[1.05] animate-subtle-drift filter hue-rotate-60"
          />
        </div>
      )}

      {/* Futuristic Scanline effect */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-1.5 w-full animate-pulse" style={{ animationDuration: "2s" }} />

      <MotionDiv
        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ startFrame: 5, type: "spring", damping: 10 }}
        className="mb-4"
      >
        <div className="w-12 h-12 rounded-lg bg-pink-500/10 neon-border-pink flex items-center justify-center text-[#f472b6]">
          <Cpu className="w-6 h-6" />
        </div>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ startFrame: 10, type: "spring", damping: 14 }}
        className="neon-text-pink text-xs uppercase tracking-[0.4em] mb-2.5 font-bold"
      >
        // {subtitle}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ startFrame: 15, type: "spring", damping: 12 }}
        className="neon-text-cyan text-4xl md:text-5xl tracking-wide uppercase text-center max-w-[800px] font-black"
      >
        {title}
      </MotionDiv>

      {description && (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ startFrame: 22, type: "spring", damping: 16 }}
          className="text-cyan-300 font-sans text-xs tracking-wider text-center max-w-[520px] mt-4 leading-relaxed font-light border-l border-cyan-500/35 pl-3.5"
        >
          {description}
        </MotionDiv>
      )}

      {/* Cyberpunk accent element */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ startFrame: 28, type: "spring", damping: 15 }}
        className="w-48 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-pink-500 mt-6"
      />
    </div>
  );
};
