import React from "react";
import { Img } from "remotion";
import { loadFont as loadHeavy } from "@remotion/google-fonts/ArchivoBlack";
import { Sparkles } from "lucide-react";
import { MotionDiv } from "../components/Motion";

const { fontFamily: heavyFont } = loadHeavy("normal");

interface ScenePlayfulProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
}

export const ScenePlayful: React.FC<ScenePlayfulProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
}) => {
  return (
    <div 
      className="relative flex flex-col items-center justify-center h-full w-full bg-[#fde047] overflow-hidden select-none"
      style={{ fontFamily: heavyFont }}
    >
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden opacity-30">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover scale-[1.03] rotate-[1.5deg] border-4 border-black"
          />
        </div>
      )}

      {/* Pop art dot background grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none -z-10"
        style={{
          backgroundImage: "radial-gradient(circle, #000 3px, transparent 3px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="flex flex-col items-center text-center p-6 max-w-[700px] w-[90%]">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.2, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 12 }}
          transition={{ startFrame: 4, type: "spring", damping: 8 }}
          className="mb-4 bg-[#c084fc] border-3 border-black p-2.5 rounded-lg pop-shadow text-black z-20"
        >
          <Sparkles className="w-8 h-8 fill-current" />
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: -80, rotate: -6 }}
          animate={{ opacity: 1, x: 0, rotate: -2 }}
          transition={{ startFrame: 9, type: "spring", damping: 9 }}
          className="bg-white border-3 border-black px-4 py-1.5 rounded-md pop-shadow text-black text-xs uppercase tracking-wider font-extrabold mb-5 z-20"
        >
          {subtitle}
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.5, rotate: 8 }}
          animate={{ opacity: 1, scale: 1, rotate: 1 }}
          transition={{ startFrame: 14, type: "spring", damping: 7 }}
          className="bg-[#fb7185] border-3 border-black p-6 rounded-xl pop-shadow text-black text-3xl md:text-5xl uppercase font-black tracking-tighter leading-none z-20"
        >
          {title}
        </MotionDiv>

        {description && (
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ startFrame: 22, type: "spring", damping: 10 }}
            className="bg-[#818cf8] border-3 border-black p-4 rounded-lg pop-shadow text-black text-xs md:text-sm tracking-wide mt-6 leading-relaxed font-sans font-bold max-w-[500px] z-20"
          >
            {description}
          </MotionDiv>
        )}
      </div>
    </div>
  );
};
