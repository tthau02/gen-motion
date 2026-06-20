/* eslint-disable @remotion/non-pure-animation */
import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";

export interface MotionConfig {
  startFrame?: number;
  duration?: number;
  type?: "spring" | "tween";
  damping?: number;
  mass?: number;
  stiffness?: number;
  easing?: (t: number) => number;
}

export interface MotionProps extends React.HTMLAttributes<HTMLDivElement> {
  initial?: {
    opacity?: number;
    x?: number;
    y?: number;
    scale?: number;
    rotate?: number;
  };
  animate?: {
    opacity?: number;
    x?: number;
    y?: number;
    scale?: number;
    rotate?: number;
  };
  transition?: MotionConfig;
  children?: React.ReactNode;
}

export const MotionDiv: React.FC<MotionProps> = ({
  initial = {},
  animate = {},
  transition = {},
  style = {},
  children,
  ...props
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = transition.startFrame ?? 0;
  const duration = transition.duration ?? 30;
  const type = transition.type ?? "spring";

  // Calculate the raw animation driver progress (0 to 1)
  let progress = 0;

  if (type === "spring") {
    progress = spring({
      frame: Math.max(0, frame - startFrame),
      fps,
      config: {
        damping: transition.damping ?? 16,
        mass: transition.mass ?? 0.6,
        stiffness: transition.stiffness ?? 120,
      },
    });
  } else {
    progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: transition.easing ?? Easing.bezier(0.16, 1, 0.3, 1),
      }
    );
  }

  // Linear mapping functions from progress (0 to 1) to desired styles
  const currentOpacity =
    initial.opacity !== undefined && animate.opacity !== undefined
      ? interpolate(progress, [0, 1], [initial.opacity, animate.opacity])
      : animate.opacity ?? 1;

  const currentX =
    initial.x !== undefined && animate.x !== undefined
      ? interpolate(progress, [0, 1], [initial.x, animate.x])
      : animate.x ?? 0;

  const currentY =
    initial.y !== undefined && animate.y !== undefined
      ? interpolate(progress, [0, 1], [initial.y, animate.y])
      : animate.y ?? 0;

  const currentScale =
    initial.scale !== undefined && animate.scale !== undefined
      ? interpolate(progress, [0, 1], [initial.scale, animate.scale])
      : animate.scale ?? 1;

  const currentRotate =
    initial.rotate !== undefined && animate.rotate !== undefined
      ? interpolate(progress, [0, 1], [initial.rotate, animate.rotate])
      : animate.rotate ?? 0;

  const animatedStyle: React.CSSProperties = {
    ...style,
    opacity: currentOpacity,
    transform: `${style.transform ?? ""} translate(${currentX}px, ${currentY}px) scale(${currentScale}) rotate(${currentRotate}deg)`.trim(),
  };

  return (
    <div style={animatedStyle} {...props}>
      {children}
    </div>
  );
};
