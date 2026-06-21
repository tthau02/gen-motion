import React from "react";
import { Img, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadMono } from "@remotion/google-fonts/FiraCode";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Compass, Code } from "lucide-react";
import { MotionDiv } from "../components/Motion";
import "./styles/SceneReact.css";

const { fontFamily: monoFont } = loadMono("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface SceneReactProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  customProps?: {
    codeSnippet?: string;
    badgeText?: string;
    [key: string]: unknown;
  };
}

const defaultCode = `import React from "react";
import { Sequence } from "remotion";

export const MyVideo = () => {
  return (
    <Sequence>
      <div className="text-gold">Chào mừng Remotion</div>
    </Sequence>
  );
};`;

export const SceneReact: React.FC<SceneReactProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  customProps = {},
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const codeSnippet = customProps?.codeSnippet || defaultCode;
  const tabTitle = customProps?.badgeText || "Component.tsx";

  // Background drift animation
  const bgScale = interpolate(frame, [0, 300], [1.06, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Compass spinning animation based on frame
  const compassRotation = interpolate(frame, [0, 300], [0, 90]);

  // Code typing animation
  const startTypingFrame = 15;
  const charsPerFrame = 2; // speed of typing
  const totalChars = codeSnippet.length;
  const typedLength = Math.min(
    totalChars,
    Math.floor(Math.max(0, frame - startTypingFrame) * charsPerFrame)
  );
  const codeToDisplay = codeSnippet.substring(0, typedLength);
  const isTypingComplete = typedLength >= totalChars;
  const showCursor = !isTypingComplete || (Math.floor(frame / 8) % 2 === 0);

  return (
    <div 
      className={`react-container flex items-center w-full h-full ${
        isVertical ? "flex-col justify-center p-6 gap-6" : "flex-row justify-between px-12 gap-12"
      }`}
    >
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover opacity-10"
            style={{
              transform: `scale(${bgScale})`,
            }}
          />
        </div>
      )}

      {/* Editor Mockup Window */}
      <MotionDiv
        initial={{ opacity: 0, x: isVertical ? 0 : -30, y: isVertical ? 20 : 0, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ startFrame: 5, type: "spring", damping: 15 }}
        className={`relative rounded-lg overflow-hidden ide-window flex flex-col ${
          isVertical ? "w-full h-[220px]" : "w-[48%] h-[340px]"
        }`}
      >
        {/* Editor Title Bar */}
        <div className="h-9 border-b border-white/5 bg-black/30 flex items-center px-4 justify-between">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <div className="flex items-center gap-1.5 h-full pt-1">
            <span className="text-[10px] text-sky-400 font-mono tracking-wider ide-tab-active px-2.5 h-full flex items-center">
              {tabTitle}
            </span>
          </div>
          <Code className="w-3.5 h-3.5 text-sky-400" />
        </div>

        {/* Editor Code Pane */}
        <div 
          className="p-4 font-mono text-[9px] leading-normal flex-1 overflow-auto custom-scrollbar"
          style={{ fontFamily: monoFont }}
        >
          <pre className="text-left w-full h-full whitespace-pre text-[#c5c8c6]">
            {codeToDisplay}
            {showCursor && <span className="code-cursor" />}
          </pre>
        </div>
      </MotionDiv>

      {/* Text Info Pane */}
      <div className={`flex flex-col justify-center ${isVertical ? "w-full text-center items-center" : "w-[52%]"}`}>
        <MotionDiv
          initial={{ opacity: 0, x: isVertical ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 15 }}
          className="flex items-center gap-2 mb-3"
        >
          <Compass
            className="w-4 h-4 text-sky-400"
            style={{ transform: `rotate(${compassRotation}deg)` }}
          />
          <span
            className="text-sky-400 font-sans text-xs tracking-widest uppercase font-bold"
            style={{ fontFamily: sansFont }}
          >
            {subtitle}
          </span>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ startFrame: 16, type: "spring", damping: 14 }}
          className="text-white font-sans font-bold tracking-tight leading-tight mb-4"
          style={{ 
            fontFamily: sansFont,
            fontSize: isVertical ? "26px" : "36px",
          }}
        >
          {title}
        </MotionDiv>

        {description && (
          <MotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ startFrame: 22, type: "spring", damping: 16 }}
            className="text-stone-300 font-sans text-xs md:text-sm leading-relaxed mb-5 font-light"
            style={{ 
              fontFamily: sansFont,
              maxWidth: isVertical ? "100%" : "95%",
            }}
          >
            {description}
          </MotionDiv>
        )}

        <div className="w-full h-[1px] bg-white/10 my-4" />
        <span
          className="text-[10px] text-stone-500 font-mono"
          style={{ fontFamily: sansFont }}
        >
          React 19 &bull; TSX Components &bull; Real-time Playback
        </span>
      </div>
    </div>
  );
};
