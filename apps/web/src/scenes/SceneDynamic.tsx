import React from "react";
import { Img } from "remotion";
import { 
  Cpu, Briefcase, Camera, Code, Music, Gamepad2, Sparkles, 
  Leaf, Terminal, Shield, BookOpen, Database, 
  TrendingUp, Globe, Activity, Eye, Zap
} from "lucide-react";
import { MotionDiv } from "../components/Motion";

interface SceneDynamicProps {
  type: string;
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  themeColor?: string;
  customProps?: {
    codeSnippet?: string;
    terminalCommand?: string;
    layoutVariant?: "center" | "split" | "spotlight" | "dashboard";
    visualStyle?: "cinematic" | "minimal" | "technical" | "bold";
    badgeText?: string;
    metricLabel?: string;
    metricValue?: string;
    chips?: string[];
    [key: string]: unknown;
  };
}

const getIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("code") || t.includes("react") || t.includes("program") || t.includes("dev") || t.includes("soft") || t.includes("web")) {
    return Code;
  }
  if (t.includes("music") || t.includes("sound") || t.includes("audio") || t.includes("podcast") || t.includes("voice") || t.includes("sing")) {
    return Music;
  }
  if (t.includes("finance") || t.includes("money") || t.includes("coin") || t.includes("bank") || t.includes("invest") || t.includes("price") || t.includes("market") || t.includes("grow") || t.includes("sale")) {
    return TrendingUp;
  }
  if (t.includes("corp") || t.includes("biz") || t.includes("business") || t.includes("work") || t.includes("office") || t.includes("job") || t.includes("strategy")) {
    return Briefcase;
  }
  if (t.includes("cyber") || t.includes("security") || t.includes("hack") || t.includes("shield") || t.includes("safe") || t.includes("lock")) {
    return Shield;
  }
  if (t.includes("system") || t.includes("server") || t.includes("performance") || t.includes("data") || t.includes("db") || t.includes("infra") || t.includes("cloud")) {
    return Database;
  }
  if (t.includes("tech") || t.includes("cpu") || t.includes("chip") || t.includes("ai") || t.includes("robot") || t.includes("hardware")) {
    return Cpu;
  }
  if (t.includes("camera") || t.includes("photo") || t.includes("vintage") || t.includes("film") || t.includes("movie") || t.includes("video") || t.includes("art")) {
    return Camera;
  }
  if (t.includes("game") || t.includes("play") || t.includes("fun") || t.includes("toy") || t.includes("sport") || t.includes("gaming")) {
    return Gamepad2;
  }
  if (t.includes("globe") || t.includes("world") || t.includes("earth") || t.includes("space") || t.includes("scale") || t.includes("orbit") || t.includes("network")) {
    return Globe;
  }
  if (t.includes("nature") || t.includes("forest") || t.includes("leaf") || t.includes("flower") || t.includes("green") || t.includes("eco") || t.includes("garden")) {
    return Leaf;
  }
  if (t.includes("learn") || t.includes("school") || t.includes("book") || t.includes("study") || t.includes("edu") || t.includes("course")) {
    return BookOpen;
  }
  if (t.includes("terminal") || t.includes("command") || t.includes("cmd") || t.includes("shell") || t.includes("bash")) {
    return Terminal;
  }
  if (t.includes("analyze") || t.includes("chart") || t.includes("metrics") || t.includes("stat") || t.includes("graph")) {
    return Activity;
  }
  if (t.includes("view") || t.includes("look") || t.includes("eye") || t.includes("vision")) {
    return Eye;
  }
  if (t.includes("speed") || t.includes("fast") || t.includes("zap") || t.includes("quick") || t.includes("power")) {
    return Zap;
  }
  return Sparkles;
};

export const SceneDynamic: React.FC<SceneDynamicProps> = ({
  type,
  title,
  subtitle,
  description,
  imageUrl,
  themeColor = "#c89547",
  customProps = {},
}) => {
  const Icon = getIcon(type);
  const {
    codeSnippet,
    terminalCommand,
    layoutVariant = "center",
    visualStyle = "cinematic",
  } = customProps;

  // Layout alignment mapping
  const alignmentClass = {
    center: "items-center text-center",
    split: "items-start text-left",
    spotlight: "items-end text-right",
    dashboard: "items-end text-right justify-end",
  }[layoutVariant];

  const wrapperAlignmentClass = {
    center: "items-center justify-center",
    split: "items-start justify-center md:pl-16",
    spotlight: "items-end justify-center md:pr-16",
    dashboard: "items-end justify-end p-12",
  }[layoutVariant];

  const visualCardClass = {
    cinematic: "bg-black/35 backdrop-blur-md border border-white/10 shadow-2xl",
    minimal: "bg-transparent border-none shadow-none",
    technical: "bg-stone-950/80 border border-[#3e342c]/50 font-mono shadow-lg",
    bold: "bg-black/75 border-2 border-white/20 shadow-2xl",
  }[visualStyle];

  const textGradient = {
    cinematic: "text-[#faf8f5] tracking-wide font-serif",
    minimal: "text-white tracking-normal font-sans",
    technical: "text-[#ded9d5] tracking-widest font-mono uppercase",
    bold: "text-white tracking-tight font-sans font-black",
  }[visualStyle];

  const isSplitLayout = layoutVariant === "split" && (!!codeSnippet || !!terminalCommand);

  return (
    <div className="relative flex flex-col h-full w-full bg-[#13100e] overflow-hidden select-none">
      {/* Background Graphic Grid */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none -z-10" 
        style={{
          backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}
      />

      {/* Dynamic theme-colored radial glow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,var(--glow-color)_0%,#0e0c0b_90%)]"
        style={{
          "--glow-color": `${themeColor}22`
        } as React.CSSProperties}
      />

      {imageUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden opacity-20">
          <Img
            src={imageUrl}
            className="w-full h-full object-cover scale-[1.05] animate-subtle-drift"
          />
        </div>
      )}

      {/* Dynamic Content Layout */}
      <div className={`flex flex-col md:flex-row items-center justify-center h-full w-full px-12 gap-8 md:gap-12 z-20 ${wrapperAlignmentClass}`}>
        
        {/* If custom code snippet exists and split layout is preferred */}
        {isSplitLayout && codeSnippet && (
          <MotionDiv
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ startFrame: 8, type: "spring", damping: 15 }}
            className="w-full md:w-[45%] h-[320px] rounded-lg overflow-hidden border border-white/10 bg-black/55 shadow-2xl flex flex-col"
          >
            <div className="h-9 border-b border-white/5 bg-black/40 flex items-center px-4 justify-between">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[9px] text-stone-500 font-mono tracking-widest uppercase">
                {type}.tsx
              </span>
              <Code className="w-3.5 h-3.5 text-stone-400" style={{ color: themeColor }} />
            </div>
            <div className="p-5 font-mono text-[9px] leading-relaxed text-stone-300 flex-1 overflow-auto custom-scrollbar">
              <pre className="text-left whitespace-pre">{codeSnippet}</pre>
            </div>
          </MotionDiv>
        )}

        {/* If custom terminal command exists and split layout is preferred */}
        {isSplitLayout && terminalCommand && (
          <MotionDiv
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ startFrame: 8, type: "spring", damping: 15 }}
            className="w-full md:w-[45%] h-[180px] rounded-lg overflow-hidden border border-stone-800 bg-[#0c0908] shadow-2xl flex flex-col"
          >
            <div className="h-9 border-b border-stone-900 bg-stone-950 flex items-center px-4 justify-between">
              <span className="text-[9px] text-stone-500 font-mono tracking-wider">TERMINAL</span>
              <Terminal className="w-3.5 h-3.5 text-stone-400" />
            </div>
            <div className="p-4 font-mono text-xs text-left leading-relaxed flex-1 flex flex-col justify-center">
              <div className="text-stone-500 flex gap-2">
                <span className="text-emerald-500">➜</span>
                <span className="text-stone-300">workspace</span>
                <span className="text-[#857467]">{terminalCommand}</span>
              </div>
              <div className="text-stone-400 mt-2 text-[10px]">
                Running script for composition generation... Done.
              </div>
            </div>
          </MotionDiv>
        )}

        {/* Main textual content wrapper */}
        <div className={`flex flex-col max-w-[650px] ${isSplitLayout ? "w-full md:w-[55%]" : "w-full"} ${alignmentClass}`}>
          
          {/* Accent Badge / Card container for non-split designs */}
          <div className={`p-8 rounded-xl flex flex-col ${isSplitLayout ? "bg-transparent border-none p-0" : visualCardClass} ${alignmentClass} w-full`}>
            
            {/* Topic Floating Icon */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ startFrame: 4, type: "spring", damping: 12 }}
              className="mb-4"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center border"
                style={{ 
                  backgroundColor: `${themeColor}15`, 
                  borderColor: `${themeColor}40`,
                  color: themeColor
                }}
              >
                <Icon className="w-6 h-6" />
              </div>
            </MotionDiv>

            {/* Subtitle */}
            <MotionDiv
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.75, y: 0 }}
              transition={{ startFrame: 8, type: "spring", damping: 15 }}
              className="text-xs uppercase tracking-[0.3em] mb-2 font-bold font-sans"
              style={{ color: themeColor }}
            >
              {subtitle}
            </MotionDiv>

            {/* Title */}
            <MotionDiv
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ startFrame: 12, type: "spring", damping: 14 }}
              className={`text-3xl md:text-4xl uppercase max-w-[550px] font-bold leading-tight ${textGradient} ${alignmentClass}`}
            >
              {title}
            </MotionDiv>

            {/* Description */}
            {description && (
              <MotionDiv
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ startFrame: 18, type: "tween", duration: 25 }}
                className="text-xs tracking-wider max-w-[460px] mt-4 leading-relaxed font-light font-sans text-stone-300"
              >
                {description}
              </MotionDiv>
            )}

            {/* Decorative bottom lines using themeColor */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ startFrame: 24, type: "spring", damping: 16 }}
              className="w-16 h-[2px] mt-6"
              style={{ backgroundColor: themeColor }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
