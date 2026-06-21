import React from "react";
import { Img, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { loadFont as loadHeavy } from "@remotion/google-fonts/ArchivoBlack";
import { Sparkles, Gamepad2, Stars } from "lucide-react";
import { MotionDiv } from "../components/Motion";
import "./styles/ScenePlayful.css";

const { fontFamily: heavyFont } = loadHeavy("normal");

interface ScenePlayfulProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  customProps?: {
    badgeText?: string;
    [key: string]: unknown;
  };
}

export const ScenePlayful: React.FC<ScenePlayfulProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  customProps = {},
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;

  const headerBadge = customProps?.badgeText || subtitle;

  // Bouncy spring configs (low damping = high bounce!)
  const springA = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 6, stiffness: 180, mass: 0.5 },
  });
  
  const springB = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 7, stiffness: 160, mass: 0.5 },
  });

  const springC = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 6, stiffness: 170, mass: 0.6 },
  });

  // Sparkles spin based on frame
  const starRotation = frame * 2.8;

  // Floating background shape y offset
  const floatY = Math.sin(frame * 0.1) * 8;

  return (
    <div 
      className="relative flex flex-col items-center justify-center h-full w-full playful-container select-none p-6 md:p-12"
      style={{ fontFamily: heavyFont }}
    >
      {/* Pop Art Dot Overlay */}
      <div className="absolute inset-0 playful-grid-dots opacity-15 pointer-events-none -z-10" />

      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden opacity-25">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover scale-[1.03] rotate-[1deg] border-4 border-black"
          />
        </div>
      )}

      {/* Floating cartoon stars in corners */}
      <div 
        className={`absolute opacity-30 text-black pointer-events-none ${
          isVertical ? "left-6 top-6" : "left-16 top-16"
        }`}
        style={{ transform: `translateY(${floatY}px) rotate(${starRotation}deg)` }}
      >
        <Stars className="w-8 h-8" />
      </div>

      <div 
        className={`absolute opacity-30 text-black pointer-events-none ${
          isVertical ? "right-6 bottom-6" : "right-16 bottom-16"
        }`}
        style={{ transform: `translateY(${-floatY}px) rotate(${-starRotation}deg)` }}
      >
        <Gamepad2 className="w-10 h-10" />
      </div>

      <div className="flex flex-col items-center text-center p-4 max-w-[700px] w-full">
        {/* Bouncy Sparkles Badge */}
        <MotionDiv
          style={{
            transform: `scale(${springA}) rotate(${starRotation}deg)`,
            opacity: springA,
          }}
          className="mb-4 bg-[#c084fc] border-[3px] border-black p-2 rounded-lg neobrutalism-card text-black z-20"
        >
          <Sparkles className="w-7 h-7 fill-current" />
        </MotionDiv>

        {/* Bouncy Subtitle Tag */}
        <MotionDiv
          style={{
            transform: `scale(${springB}) rotate(${-2 + (1 - springB) * 15}deg)`,
            opacity: springB,
          }}
          className="bg-white border-[3px] border-black px-4 py-1.5 rounded-md neobrutalism-card text-black text-xs uppercase tracking-wider font-extrabold mb-5 z-20"
        >
          {headerBadge}
        </MotionDiv>

        {/* Bouncy Title Header */}
        <MotionDiv
          style={{
            transform: `scale(${springC}) rotate(${1 - (1 - springC) * 10}deg)`,
            opacity: springC,
          }}
          className="bg-[#fb7185] border-[3px] border-black p-5 md:p-6 rounded-xl neobrutalism-card text-black uppercase font-black tracking-tighter leading-none z-20"
        >
          <span style={{ fontSize: isVertical ? "28px" : "44px" }}>
            {title}
          </span>
        </MotionDiv>

        {description && (
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ startFrame: 24, type: "spring", damping: 10 }}
            className="bg-[#818cf8] border-[3px] border-black p-4 rounded-lg neobrutalism-card text-black text-xs md:text-sm tracking-wide mt-6 leading-relaxed font-sans font-bold max-w-[500px] z-20"
          >
            {description}
          </MotionDiv>
        )}
      </div>
    </div>
  );
};
