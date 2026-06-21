import React from "react";
import { Img, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Briefcase, TrendingUp } from "lucide-react";
import { MotionDiv } from "../components/Motion";
import "./styles/SceneCorporate.css";

const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface SceneCorporateProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  customProps?: {
    badgeText?: string;
    metricLabel?: string;
    metricValue?: string;
    [key: string]: unknown;
  };
}

export const SceneCorporate: React.FC<SceneCorporateProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  customProps = {},
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const headerBadge = customProps?.badgeText || "Q4 Enterprise Growth";
  const chartLabel = customProps?.metricLabel || "Valuation Growth";
  const chartValue = customProps?.metricValue || "+245.8% YTD";

  // Background slow zoom
  const bgScale = interpolate(frame, [0, 300], [1.03, 1.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated line graph path drawing
  const chartLength = 350;
  const lineDrawProgress = interpolate(frame, [15, 90], [chartLength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Coordinates of the tracking glow point on the graph line
  const trackingX = interpolate(frame, [15, 90], [20, 280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const trackingY = interpolate(frame, [15, 90], [80, 15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div 
      className={`corp-container flex items-center w-full h-full ${
        isVertical ? "flex-col justify-center p-6 gap-6" : "flex-row justify-between px-12 gap-12"
      }`}
      style={{ fontFamily: sansFont }}
    >
      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden opacity-10">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover"
            style={{
              transform: `scale(${bgScale})`,
            }}
          />
        </div>
      )}

      {/* Decorative corporate dot chart background */}
      <div 
        className="absolute inset-x-0 bottom-0 h-48 opacity-10 pointer-events-none -z-10"
        style={{
          backgroundImage: "radial-gradient(circle, #38bdf8 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Column: Visual Growth Stock Chart Mockup */}
      <MotionDiv
        initial={{ opacity: 0, x: isVertical ? 0 : -30, y: isVertical ? 20 : 0, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ startFrame: 5, type: "spring", damping: 15 }}
        className={`rounded-xl corp-panel p-4 flex flex-col justify-between ${
          isVertical ? "w-full h-[220px]" : "w-[45%] h-[300px]"
        }`}
      >
        <div className="flex justify-between items-center border-b border-sky-500/10 pb-2">
          <span className="text-[9px] text-sky-400 font-mono tracking-widest uppercase">
            {headerBadge}
          </span>
          <TrendingUp className="w-4 h-4 text-sky-400" />
        </div>

        {/* Growth Line Graph SVG */}
        <div className="flex-1 my-2 border border-white/5 rounded bg-slate-950/40 relative overflow-hidden p-2 min-h-[80px]">
          <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
            {/* Grid Line Marks */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />
            <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />
            
            {/* Self-drawing Line Chart */}
            <path
              d="M 20 80 Q 70 85 110 65 T 200 40 T 280 15"
              className="corp-chart-path"
              strokeDasharray={chartLength}
              strokeDashoffset={lineDrawProgress}
            />

            {/* Glowing active point tracking the line drawing */}
            {frame >= 15 && (
              <circle
                cx={trackingX}
                cy={trackingY}
                r="4.5"
                fill="#38bdf8"
                className="corp-grid-dot"
                style={{
                  filter: "drop-shadow(0 0 4px #38bdf8)",
                }}
              />
            )}
          </svg>
          <div className="absolute top-2 left-2 flex flex-col">
            <span className="text-[6px] text-slate-500 uppercase">{chartLabel}</span>
            <span className="text-xs text-white font-mono font-bold">{chartValue}</span>
          </div>
        </div>

        <div className="flex justify-between text-[8px] text-sky-400/60 font-mono tracking-widest shrink-0">
          <span>TICKER: RETN</span>
          <span>MARKET: SECURE</span>
        </div>
      </MotionDiv>

      {/* Column: Info Panel */}
      <div className={`flex flex-col justify-center ${isVertical ? "w-full text-center items-center" : "w-[55%]"}`}>
        <MotionDiv
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 18 }}
          className="mb-4"
        >
          <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ startFrame: 12, type: "tween", duration: 25 }}
          className="text-sky-400 text-[10px] uppercase tracking-[0.35em] font-bold mb-3"
        >
          {subtitle}
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ startFrame: 16, type: "spring", damping: 15 }}
          className="text-white font-bold uppercase leading-tight"
          style={{ 
            fontSize: isVertical ? "26px" : "36px",
          }}
        >
          {title}
        </MotionDiv>

        {description && (
          <MotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.75, y: 0 }}
            transition={{ startFrame: 22, type: "tween", duration: 30 }}
            className="text-slate-300 text-xs md:text-sm tracking-wide mt-4 max-w-[480px] leading-relaxed font-light"
          >
            {description}
          </MotionDiv>
        )}

        <MotionDiv
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ startFrame: 28, type: "spring", damping: 16 }}
          className="w-16 h-[2px] bg-sky-400 mt-6"
        />
      </div>
    </div>
  );
};
