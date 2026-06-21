import React from "react";
import { Img, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadMono } from "@remotion/google-fonts/ShareTechMono";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Layers, Database, Cpu, Play } from "lucide-react";
import { MotionDiv } from "../components/Motion";
import "./styles/SceneScale.css";

const { fontFamily: monoFont } = loadMono("normal", { weights: ["400"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface SceneScaleProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  customProps?: {
    badgeText?: string;
    metricLabel?: string;
    metricValue?: string;
    chips?: string[];
    [key: string]: unknown;
  };
}

export const SceneScale: React.FC<SceneScaleProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  customProps = {},
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const nodeLabel1 = customProps?.chips?.[0] || "DB Source";
  const nodeLabel2 = customProps?.metricLabel || "AWS Lambda";
  const nodeLabel3 = customProps?.chips?.[1] || "render.mp4";
  const nodeStatus = customProps?.metricValue || "SUCCESS";

  // Background drift scale
  const bgScale = interpolate(frame, [0, 300], [1.05, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dynamic floating heights/offsets using cosine waves based on frame
  const floatA = Math.cos(frame * 0.06) * 4;
  const floatB = Math.sin(frame * 0.07) * 5;
  const floatC = Math.cos(frame * 0.08) * 3;

  // Animated dash offsets for SVG wires
  const flowDash = -frame * 2.5;

  return (
    <div 
      className={`scale-container flex items-center w-full h-full ${
        isVertical ? "flex-col justify-center p-6 gap-6" : "flex-row-reverse justify-between px-12 gap-12"
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

      {/* Interactive Network Diagram */}
      <div 
        className={`relative flex px-2 shrink-0 ${
          isVertical 
            ? "w-full h-[220px] flex-col items-center justify-between py-2" 
            : "w-[45%] h-[280px] flex-row items-center justify-between"
        }`}
      >
        {/* SVG Wires Connecting Nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {isVertical ? (
            <>
              {/* Vertical Wire 1: Top to Middle */}
              <line
                x1={width ? width * 0.45 / 2 : 160}
                y1="40"
                x2={width ? width * 0.45 / 2 : 160}
                y2="110"
                className="node-connector"
                strokeWidth="2"
                style={{ strokeDashoffset: flowDash }}
              />
              {/* Vertical Wire 2: Middle to Bottom */}
              <line
                x1={width ? width * 0.45 / 2 : 160}
                y1="110"
                x2={width ? width * 0.45 / 2 : 160}
                y2="180"
                className="node-connector"
                strokeWidth="2"
                style={{ strokeDashoffset: flowDash }}
              />
            </>
          ) : (
            <>
              {/* Horizontal Wire 1: Database to Serverless */}
              <line
                x1="70"
                y1="140"
                x2="210"
                y2="140"
                className="node-connector"
                strokeWidth="2"
                style={{ strokeDashoffset: flowDash }}
              />
              {/* Horizontal Wire 2: Serverless to Video Output */}
              <line
                x1="210"
                y1="140"
                x2="330"
                y2="140"
                className="node-connector"
                strokeWidth="2"
                style={{ strokeDashoffset: flowDash }}
              />
            </>
          )}
        </svg>

        {/* Node 1: Database Source */}
        <MotionDiv
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ startFrame: 10, type: "spring", damping: 13 }}
          className={`rounded scale-window p-2 flex flex-col justify-between items-center text-center relative z-10 ${
            isVertical ? "w-48 h-12 flex-row gap-4" : "w-20 h-28"
          }`}
          style={{ transform: isVertical ? `translateX(${floatA}px)` : `translateY(${floatA}px)` }}
        >
          <Database className="w-4.5 h-4.5 text-sky-400 shrink-0" />
          <div 
            className="font-mono text-[7px] leading-tight text-slate-400 text-left truncate"
            style={{ fontFamily: monoFont }}
          >
            ID: 9812
          </div>
          <span className="text-[7px] text-sky-400 font-bold uppercase tracking-wider truncate">
            {nodeLabel1}
          </span>
        </MotionDiv>

        {/* Node 2: Serverless Core CPU */}
        <MotionDiv
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ startFrame: 20, type: "spring", damping: 12 }}
          className={`rounded scale-window p-2 flex flex-col justify-between items-center text-center relative z-20 border-sky-400/40 ${
            isVertical ? "w-52 h-14 flex-row gap-4" : "w-24 h-32"
          }`}
          style={{ transform: isVertical ? `translateX(${floatB}px)` : `translateY(${floatB}px)` }}
        >
          <Cpu className="w-5.5 h-5.5 text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)] shrink-0" />
          <div className="flex flex-col items-center justify-center flex-1">
            <span className="text-[8px] text-white font-bold truncate max-w-[80px]">{nodeLabel2}</span>
            <span className="text-[5px] text-sky-400/60 font-mono tracking-wider mt-0.5 uppercase">
              Processing
            </span>
          </div>
          <span className="text-[6px] text-slate-500 font-mono tracking-widest uppercase shrink-0">
            Cluster Core
          </span>
        </MotionDiv>

        {/* Node 3: MP4 Video Output */}
        <MotionDiv
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ startFrame: 30, type: "spring", damping: 13 }}
          className={`rounded scale-window p-2 flex flex-col justify-between items-center text-center relative z-10 ${
            isVertical ? "w-48 h-12 flex-row gap-4" : "w-20 h-28"
          }`}
          style={{ transform: isVertical ? `translateX(${floatC}px)` : `translateY(${floatC}px)` }}
        >
          <div className="rounded bg-slate-900/60 flex items-center justify-center border border-white/5 p-1 shrink-0">
            <Play className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex flex-col items-start justify-center flex-1">
            <span className="text-[7px] text-white font-bold font-mono truncate max-w-[80px]">{nodeLabel3}</span>
            <span className="text-[5px] text-emerald-400 font-mono font-bold">{nodeStatus}</span>
          </div>
          <span className="text-[7px] text-sky-400 font-bold uppercase tracking-wider shrink-0">
            OUTPUT
          </span>
        </MotionDiv>
      </div>

      {/* Info Pane */}
      <div className={`flex flex-col justify-center ${isVertical ? "w-full text-center items-center" : "w-[55%]"}`}>
        <MotionDiv
          initial={{ opacity: 0, x: isVertical ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 15 }}
          className="flex items-center gap-2 mb-3"
        >
          <Layers className="w-4 h-4 text-sky-400" />
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
          JSON Metadata Input &bull; Cloud Lambda Functions &bull; MP4 Bundler
        </span>
      </div>
    </div>
  );
};
