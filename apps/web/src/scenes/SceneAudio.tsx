import React from "react";
import { Img, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { Music, Radio } from "lucide-react";
import { MotionDiv } from "../components/Motion";
import "./styles/SceneAudio.css";

const { fontFamily: sansFont } = loadSans("normal", { weights: ["400", "700"] });

interface SceneAudioProps {
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

export const SceneAudio: React.FC<SceneAudioProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  customProps = {},
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const headerBadge = customProps?.badgeText || "Stereo EQ Monitor";
  const footerMetric = customProps?.metricLabel 
    ? `${customProps.metricLabel.toUpperCase()}: ${customProps.metricValue || "ON"}`
    : "PEAK LEVELS: -3.5dB • SAMPLE RATE: 48kHz";

  // Background drift scale
  const bgScale = interpolate(frame, [0, 300], [1.05, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate vinyl disc rotation angle based on frame
  const vinylRotation = (frame * 1.5) % 360;

  // Pulse volume indicator
  const radioPulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.85, 1.15]);

  // Waveform bars count based on ratio
  const barCount = isVertical ? 10 : 15;
  const barHeightLimit = isVertical ? 35 : 55;

  return (
    <div 
      className={`audio-container flex items-center w-full h-full ${
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

      {/* Audio Visualizer Deck */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95, y: isVertical ? 20 : 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ startFrame: 5, type: "spring", damping: 15 }}
        className={`relative rounded-lg overflow-hidden audio-card flex flex-col justify-between ${
          isVertical ? "w-full h-[220px] p-4" : "w-[48%] h-[320px] p-6"
        }`}
      >
        <div className="flex justify-between items-center border-b border-purple-500/10 pb-2">
          <span className="text-[9px] text-purple-400 font-mono tracking-widest uppercase">
            {headerBadge}
          </span>
          <Radio 
            className="w-4 h-4 text-purple-400" 
            style={{ transform: `scale(${radioPulse})` }}
          />
        </div>

        {/* Vinyl and Waveform Split Area */}
        <div className={`flex-1 flex justify-center items-center gap-5 my-2 ${isVertical ? "flex-row" : "flex-col"}`}>
          {/* Rotating Vinyl Record Mockup */}
          <div 
            className={`rounded-full vinyl-record flex items-center justify-center relative shrink-0 ${
              isVertical ? "w-16 h-16" : "w-24 h-24"
            }`}
            style={{ transform: `rotate(${vinylRotation}deg)` }}
          >
            {/* Grooves */}
            <div className="absolute inset-2 border border-white/5 rounded-full" />
            <div className="absolute inset-4 border border-white/5 rounded-full" />
            {/* Center Label */}
            <div className="w-6 h-6 rounded-full vinyl-center flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1b121f]" />
            </div>
          </div>

          {/* Dynamic Soundwave Equalizer Bars */}
          <div className={`flex items-end justify-center gap-1.5 w-full px-2 ${isVertical ? "h-14" : "h-16"}`}>
            {[...Array(barCount)].map((_, i) => {
              const height = interpolate(
                Math.sin((frame + i * 3.5) * 0.28) +
                  Math.cos((frame - i * 1.8) * 0.16) * 1.2,
                [-2.2, 2.2],
                [6, barHeightLimit],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              return (
                <div
                  key={i}
                  className="w-2 rounded-t waveform-bar"
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>
        </div>

        <div className="text-center text-[8px] text-purple-400/60 font-mono tracking-widest uppercase">
          {footerMetric}
        </div>
      </MotionDiv>

      {/* Info Pane */}
      <div className={`flex flex-col justify-center ${isVertical ? "w-full text-center items-center" : "w-[52%]"}`}>
        <MotionDiv
          initial={{ opacity: 0, x: isVertical ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ startFrame: 10, type: "spring", damping: 15 }}
          className="flex items-center gap-2 mb-3"
        >
          <Music className="w-4 h-4 text-purple-400" />
          <span
            className="text-purple-400 font-sans text-xs tracking-widest uppercase font-bold"
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
          Frequency Analysis &bull; Bass-Reactive Shapes &bull; Stereo Audio
        </span>
      </div>
    </div>
  );
};
