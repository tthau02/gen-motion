import React from "react";
import {
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Activity,
  BookOpen,
  Briefcase,
  Camera,
  Code,
  Cpu,
  Database,
  Eye,
  Gamepad2,
  Globe,
  Leaf,
  Music,
  Shield,
  Sparkles,
  Terminal,
  TrendingUp,
  Zap,
} from "lucide-react";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { MotionDiv } from "../components/Motion";

const { fontFamily: serifFont } = loadSerif("normal", { weights: ["400", "700"] });
const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

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
    shotType?:
      | "wide"
      | "close-up"
      | "detail"
      | "editorial"
      | "documentary"
      | "data-insert";
    focalPoint?: string;
    captionStyle?: "none" | "lower-third" | "chapter" | "caption" | "annotation";
    textureLevel?: "none" | "subtle" | "medium";
    overlayDensity?: "none" | "low" | "medium";
    supportingDetails?: string[];
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

const sentenceCase = (value: string) => {
  const lower = value.toLocaleLowerCase("vi-VN");
  return lower.charAt(0).toLocaleUpperCase("vi-VN") + lower.slice(1);
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
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const Icon = getIcon(type);

  const {
    codeSnippet,
    terminalCommand,
    layoutVariant = "center",
    visualStyle = "cinematic",
    badgeText,
    metricLabel,
    metricValue,
    chips = [],
    shotType = visualStyle === "technical" ? "data-insert" : "editorial",
    focalPoint,
    captionStyle = layoutVariant === "dashboard" ? "annotation" : "lower-third",
    textureLevel = "subtle",
    overlayDensity = layoutVariant === "dashboard" ? "medium" : "low",
    supportingDetails = [],
  } = customProps;

  const isDataScene =
    shotType === "data-insert" ||
    visualStyle === "technical" ||
    layoutVariant === "dashboard" ||
    Boolean(codeSnippet || terminalCommand || metricLabel || metricValue);

  const imageScale = interpolate(frame, [0, 240], [1.04, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const imageX = interpolate(
    frame,
    [0, 240],
    layoutVariant === "spotlight" ? [12, -8] : [-10, 8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const textureOpacity =
    textureLevel === "medium" ? 0.12 : textureLevel === "subtle" ? 0.055 : 0;
  const overlayOpacity =
    overlayDensity === "medium" ? 0.72 : overlayDensity === "low" ? 0.48 : 0.26;

  const contentPosition = isVertical
    ? {
        left: 34,
        right: 34,
        bottom: 70,
        maxWidth: "none",
        alignItems: "flex-start",
        textAlign: "left" as const,
      }
    : layoutVariant === "spotlight"
      ? {
          right: 76,
          bottom: 68,
          maxWidth: 540,
          alignItems: "flex-end",
          textAlign: "right" as const,
        }
      : layoutVariant === "split"
        ? {
            left: 72,
            bottom: 64,
            maxWidth: 560,
            alignItems: "flex-start",
            textAlign: "left" as const,
          }
        : {
            left: 76,
            bottom: 68,
            maxWidth: 620,
            alignItems: "flex-start",
            textAlign: "left" as const,
          };

  const titleFont = visualStyle === "technical" ? sansFont : serifFont;
  const titleSize = isVertical ? 34 : isDataScene ? 42 : 58;
  const showCaptionChrome = captionStyle !== "none" && !isDataScene;
  const showDetails = supportingDetails.length > 0 && overlayDensity !== "none";
  const showChips = isDataScene && chips.length > 0;

  return (
    <div
      className="relative h-full w-full overflow-hidden select-none"
      style={{
        backgroundColor: "#0d0b09",
        color: "#f7f2ea",
        fontFamily: sansFont,
      }}
    >
      {imageUrl ? (
        <div className="absolute inset-0 overflow-hidden">
          <Img
            src={imageUrl}
            className="h-full w-full object-cover"
            style={{
              transform: `translateX(${imageX}px) scale(${imageScale})`,
              filter:
                visualStyle === "minimal"
                  ? "saturate(0.9) contrast(1.04)"
                  : visualStyle === "technical"
                    ? "saturate(0.62) contrast(1.14)"
                    : "saturate(0.82) contrast(1.08)",
            }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, #15110e 0%, ${themeColor}22 46%, #080706 100%)`,
          }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background: isVertical
            ? `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,${overlayOpacity}) 54%, rgba(0,0,0,0.86))`
            : `linear-gradient(90deg, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,0.36) 43%, rgba(0,0,0,0.1) 100%)`,
        }}
      />

      {textureOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: textureOpacity,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)",
            backgroundSize: "100% 5px",
            mixBlendMode: "overlay",
          }}
        />
      )}

      {isDataScene && (
        <MotionDiv
          initial={{ opacity: 0, x: isVertical ? 0 : 28, y: isVertical ? -14 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 18 }}
          className="absolute border border-white/[0.12] bg-black/[0.45]"
          style={{
            right: isVertical ? 34 : 72,
            top: isVertical ? 54 : 72,
            width: isVertical ? "calc(100% - 68px)" : 360,
            borderRadius: 8,
            padding: 18,
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <span className="text-[10px] font-semibold text-white/60">
              {badgeText || focalPoint || sentenceCase(type)}
            </span>
            <Icon className="h-4 w-4" style={{ color: themeColor }} />
          </div>

          {(metricValue || metricLabel) && (
            <div className="mt-4">
              {metricValue && (
                <div className="text-[34px] leading-none font-bold">
                  {metricValue}
                </div>
              )}
              {metricLabel && (
                <div className="mt-2 text-[11px] text-white/58">
                  {metricLabel}
                </div>
              )}
            </div>
          )}

          {(codeSnippet || terminalCommand) && (
            <pre
              className="mt-4 max-h-[150px] overflow-hidden whitespace-pre-wrap text-[10px] leading-relaxed text-white/70"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace" }}
            >
              {codeSnippet || `$ ${terminalCommand}`}
            </pre>
          )}

          {showChips && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.slice(0, 3).map((chip) => (
                <span
                  key={chip}
                  className="rounded border border-white/[0.12] px-2 py-1 text-[10px] text-white/60"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </MotionDiv>
      )}

      <div
        className="absolute flex flex-col"
        style={{
          ...contentPosition,
        }}
      >
        {showCaptionChrome && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ startFrame: 6, type: "spring", damping: 18 }}
            className="mb-5 h-[1px]"
            style={{
              width: isVertical ? 78 : 116,
              backgroundColor: themeColor,
            }}
          />
        )}

        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 0.74, y: 0 }}
          transition={{ startFrame: 8, type: "tween", duration: 22 }}
          className="mb-3 text-[12px] font-semibold"
          style={{
            color: themeColor,
            letterSpacing: "0.08em",
          }}
        >
          {subtitle}
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ startFrame: 12, type: "spring", damping: 18 }}
          className="leading-[0.98]"
          style={{
            fontFamily: titleFont,
            fontSize: titleSize,
            fontWeight: visualStyle === "minimal" ? 400 : 700,
            letterSpacing: 0,
            textTransform: visualStyle === "technical" ? "uppercase" : "none",
          }}
        >
          {visualStyle === "technical" ? title : sentenceCase(title)}
        </MotionDiv>

        {description && (
          <MotionDiv
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 0.78, y: 0 }}
            transition={{ startFrame: 20, type: "tween", duration: 26 }}
            className="mt-5 text-[14px] leading-relaxed"
            style={{
              maxWidth: isVertical ? "100%" : 480,
              color: "#eee4d8",
            }}
          >
            {description}
          </MotionDiv>
        )}

        {showDetails && (
          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.68, y: 0 }}
            transition={{ startFrame: 28, type: "tween", duration: 24 }}
            className="mt-6 grid gap-1.5 text-[11px] leading-snug text-white/70"
          >
            {supportingDetails.slice(0, 3).map((detail) => (
              <div key={detail} className="flex gap-2">
                <span style={{ color: themeColor }}>-</span>
                <span>{detail}</span>
              </div>
            ))}
          </MotionDiv>
        )}
      </div>
    </div>
  );
};
