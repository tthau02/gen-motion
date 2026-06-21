import React from "react";
import { Img, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/ShareTechMono";
import { Zap, Activity } from "lucide-react";
import { MotionDiv } from "../components/Motion";
import "./styles/ScenePerformance.css";

const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });
const { fontFamily: monoFont } = loadMono("normal", { weights: ["400"] });

interface ScenePerformanceProps {
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

export const ScenePerformance: React.FC<ScenePerformanceProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  customProps = {},
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const headerBadge = customProps?.badgeText || "Performance Core Monitor";
  const statLabel = customProps?.metricLabel || "Avg Server Load";

  // Calculate live CPU utilization metrics based on frame
  const cpuPercent = interpolate(
    Math.sin(frame * 0.1) + Math.cos(frame * 0.05),
    [-2, 2],
    [92.4, 99.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ).toFixed(1);

  const statValue = customProps?.metricValue || `${cpuPercent}%`;

  // Background drift
  const bgScale = interpolate(frame, [0, 300], [1.05, 1.13], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Self-drawing SVG path parameters
  const pathLength = 400;
  const graphDrawOffset = interpolate(frame, [15, 95], [pathLength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Display thread count
  const threadCount = isVertical ? 2 : 3;

  return (
    <div 
      className={`performance-container flex items-center w-full h-full ${
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

      {/* Analytics Dashboard Card */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95, y: isVertical ? 20 : 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ startFrame: 5, type: "spring", damping: 15 }}
        className={`relative rounded-lg overflow-hidden performance-card flex flex-col justify-between ${
          isVertical ? "w-full h-[220px] p-4" : "w-[48%] h-[320px] p-5"
        }`}
      >
        <div className="flex justify-between items-center border-b border-green-500/10 pb-2">
          <span className="text-[9px] text-green-400 font-mono tracking-widest uppercase">
            {headerBadge}
          </span>
          <Activity className="w-4 h-4 text-green-400" />
        </div>

        {/* Dynamic Graph and CPU Load Details */}
        <div className="flex-1 flex flex-col justify-between my-2 gap-2">
          {/* Animated Line Chart SVG */}
          <div className="flex-1 border border-white/5 rounded bg-black/40 relative overflow-hidden p-2 min-h-[75px]">
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="25" x2="300" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="75" x2="300" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              
              {/* Drawing Path Line */}
              <path
                d="M 10 90 Q 50 35 90 70 T 170 20 T 250 80 T 290 15"
                className="perf-graph-line"
                strokeDasharray={pathLength}
                strokeDashoffset={graphDrawOffset}
              />
            </svg>
            <div className="absolute top-2 left-2 flex flex-col">
              <span className="text-[7px] text-slate-500 font-mono uppercase">{statLabel}</span>
              <span 
                className="text-xs text-green-400 font-mono font-bold"
                style={{ fontFamily: monoFont }}
              >
                {statValue}
              </span>
            </div>
          </div>

          {/* Render threads progress widgets */}
          <div className="flex flex-col gap-1.5 shrink-0">
            {[...Array(threadCount)].map((_, coreIndex) => {
              const coreNum = coreIndex + 1;
              const coreScale = interpolate(
                Math.sin(frame * 0.12 + coreNum * 2),
                [-1, 1],
                [75, 100]
              );
              return (
                <div key={coreNum} className="h-5 rounded bg-black/30 border border-white/5 flex items-center px-2 justify-between">
                  <span className="text-[7px] text-slate-300 font-mono uppercase">Worker thread #{coreNum}</span>
                  <div className="w-20 md:w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full core-progress-bar rounded-full" 
                      style={{ width: `${coreScale}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between text-[8px] text-green-400/60 font-mono tracking-widest shrink-0">
          <span>CORES: ACTIVE</span>
          <span>LATENCY: 0.15ms</span>
        </div>
      </MotionDiv>

      {/* Info Pane */}
      <div className={`flex flex-col justify-center ${isVertical ? "w-full text-center items-center" : "w-[52%]"}`}>
        <MotionDiv
          initial={{ opacity: 0, x: isVertical ? 0 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 15 }}
          className="flex items-center gap-2 mb-3"
        >
          <Zap className="w-4 h-4 text-green-400" />
          <span
            className="text-green-400 font-sans text-xs tracking-widest uppercase font-bold"
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
          Parallel Core Bundling &bull; 60fps Native Encoding &bull; GPU Acceleration
        </span>
      </div>
    </div>
  );
};
