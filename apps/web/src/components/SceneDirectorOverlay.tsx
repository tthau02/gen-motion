import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { VideoScene } from "../types";

type SceneUiProps = NonNullable<VideoScene["customProps"]>;

interface SceneDirectorOverlayProps {
  customProps?: SceneUiProps;
  themeColor: string;
}

const layoutPosition: Record<string, React.CSSProperties> = {
  center: {
    left: 80,
    right: 80,
    bottom: 58,
    alignItems: "center",
    textAlign: "center",
  },
  split: {
    left: 72,
    bottom: 58,
    alignItems: "flex-start",
    textAlign: "left",
  },
  spotlight: {
    right: 72,
    top: 70,
    alignItems: "flex-end",
    textAlign: "right",
  },
  dashboard: {
    right: 72,
    bottom: 58,
    alignItems: "flex-end",
    textAlign: "right",
  },
};

export const SceneDirectorOverlay: React.FC<SceneDirectorOverlayProps> = ({
  customProps,
  themeColor,
}) => {
  const frame = useCurrentFrame();
  if (!customProps) return null;

  const {
    layoutVariant = "center",
    visualStyle = "cinematic",
    badgeText,
    metricLabel,
    metricValue,
    chips = [],
  } = customProps;

  if (!badgeText && !metricLabel && !metricValue && chips.length === 0) {
    return null;
  }

  const progress = interpolate(frame, [8, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const panelOpacity =
    visualStyle === "minimal" ? 0.18 : visualStyle === "bold" ? 0.42 : 0.28;
  const borderOpacity =
    visualStyle === "technical" ? 0.7 : visualStyle === "minimal" ? 0.28 : 0.48;

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 45,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 410,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 18}px)`,
        pointerEvents: "none",
        ...layoutPosition[layoutVariant],
      }}
    >
      {badgeText && (
        <div
          style={{
            alignSelf: layoutVariant === "center" ? "center" : "inherit",
            padding: "7px 12px",
            borderRadius: 999,
            color: themeColor,
            background: `rgba(0,0,0,${panelOpacity})`,
            border: `1px solid ${themeColor}${Math.round(borderOpacity * 255)
              .toString(16)
              .padStart(2, "0")}`,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {badgeText}
        </div>
      )}

      {(metricLabel || metricValue) && (
        <div
          style={{
            minWidth: 220,
            padding: "16px 18px",
            borderRadius: 10,
            background: `linear-gradient(135deg, rgba(0,0,0,0.55), ${themeColor}22)`,
            border: `1px solid ${themeColor}66`,
            boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
          }}
        >
          {metricValue && (
            <div
              style={{
                color: "#faf8f5",
                fontSize: 36,
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: "0.02em",
              }}
            >
              {metricValue}
            </div>
          )}
          {metricLabel && (
            <div
              style={{
                marginTop: 8,
                color: themeColor,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {metricLabel}
            </div>
          )}
        </div>
      )}

      {chips.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent:
              layoutVariant === "spotlight" || layoutVariant === "dashboard"
                ? "flex-end"
                : layoutVariant === "center"
                  ? "center"
                  : "flex-start",
            gap: 8,
          }}
        >
          {chips.slice(0, 4).map((chip) => (
            <span
              key={chip}
              style={{
                padding: "7px 10px",
                borderRadius: 6,
                color: "#faf8f5",
                background:
                  visualStyle === "technical"
                    ? "rgba(2,132,199,0.22)"
                    : "rgba(250,248,245,0.1)",
                border: "1px solid rgba(250,248,245,0.18)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
