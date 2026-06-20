/* eslint-disable @remotion/non-pure-animation */
import React, { useMemo, useState } from "react";
import {
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { VideoMetadata } from "../../types";
import { PreviewZoom, PreviewZoomOption } from "./types";

interface TimelineProps {
  currentFrame: number;
  totalFrames: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  videoData: VideoMetadata;
  selectedSceneIndex: number;
  previewZoom: PreviewZoom;
  previewZoomOptions: PreviewZoomOption[];
  isPreviewExpanded: boolean;
  onPreviewZoomChange: (zoom: PreviewZoom) => void;
  onTogglePreviewExpanded: () => void;
  formatFrameToTime: (frame: number) => string;
  handleSeek: (frame: number) => void;
  onSceneSelect: (index: number, startFrame: number) => void;
  handlePlayPause: () => void;
  toggleMute: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowAiModal: (show: boolean) => void;
  onOpenRenderModal: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  currentFrame,
  totalFrames,
  isPlaying,
  isMuted,
  volume,
  videoData,
  selectedSceneIndex,
  previewZoom,
  previewZoomOptions,
  isPreviewExpanded,
  onPreviewZoomChange,
  onTogglePreviewExpanded,
  formatFrameToTime,
  handleSeek,
  onSceneSelect,
  handlePlayPause,
  toggleMute,
  handleVolumeChange,
  setShowAiModal,
  onOpenRenderModal
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const basePixelsPerFrame = 1.25;
  const pixelsPerFrame = basePixelsPerFrame * zoomLevel;
  const timelineWidth = Math.max(totalFrames * pixelsPerFrame, 1);

  const sceneLayout = useMemo(() => {
    let startFrame = 0;
    return videoData.scenes.map((scene, index) => {
      const layout = {
        scene,
        startFrame,
        left: startFrame * pixelsPerFrame,
        width: Math.max(scene.durationInFrames * pixelsPerFrame, 24),
      };

      startFrame += scene.durationInFrames;
      const isLast = index === videoData.scenes.length - 1;
      if (!isLast && scene.effect !== "none") {
        startFrame -= 10;
      }

      return layout;
    });
  }, [pixelsPerFrame, videoData.scenes]);

  const rulerTicks = useMemo(() => {
    const seconds = Math.ceil(totalFrames / 30);
    return Array.from({ length: seconds + 1 }, (_, sec) => ({
      sec,
      left: sec * 30 * pixelsPerFrame,
    }));
  }, [pixelsPerFrame, totalFrames]);

  const handleZoomChange = (nextZoom: number) => {
    setZoomLevel(Math.max(0.5, Math.min(4, nextZoom)));
  };

  const handleTimelinePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frame = Math.round((e.clientX - rect.left) / pixelsPerFrame);
    handleSeek(frame);
  };

  const parsePreviewZoom = (value: string): PreviewZoom => {
    if (value === "fit") return "fit";
    return Number(value) as PreviewZoom;
  };

  return (
    <footer className="h-full border-t border-[#2b2420] bg-[#181412] flex flex-col shrink-0">
      {/* Playback Controls & Settings */}
      <div className="h-11 border-b border-[#2b2420] flex items-center justify-between px-4 bg-[#1b1714]">
        {/* Left stats */}
        <div className="flex items-center gap-3 font-mono text-[10px] text-[#a3978f]">
          <span className="text-white text-xs font-semibold">{formatFrameToTime(currentFrame)}</span>
          <span className="text-[#6b5d53]">&bull;</span>
          <span>
            FRAME: <span className="text-vintage-gold font-bold">{currentFrame}</span> / {totalFrames}
          </span>
        </div>

        {/* Center Playback button group */}
        <div className="flex items-center gap-3 bg-[#110d0b] border border-[#2b2420] rounded-full px-3 py-1 shadow-inner">
          <button
            onClick={() => handleSeek(0)}
            className="p-1 hover:bg-[#2d2621] rounded text-[#a3978f] hover:text-white transition-colors cursor-pointer bg-transparent border-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleSeek(currentFrame - 30)}
            className="text-[10px] font-bold px-1.5 py-0.5 hover:bg-[#2d2621] rounded text-[#a3978f] hover:text-white transition-colors cursor-pointer bg-transparent border-none"
          >
            -1s
          </button>
          <button
            onClick={handlePlayPause}
            className="w-7 h-7 rounded-full bg-vintage-gold hover:bg-[#b08138] flex items-center justify-center text-black hover:scale-105 transition-all shadow cursor-pointer border-none"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={() => handleSeek(currentFrame + 30)}
            className="text-[10px] font-bold px-1.5 py-0.5 hover:bg-[#2d2621] rounded text-[#a3978f] hover:text-white transition-colors cursor-pointer bg-transparent border-none"
          >
            +1s
          </button>
          <div className="w-[1px] h-3 bg-[#2b2420]" />
          <button
            onClick={toggleMute}
            className="p-1 hover:bg-[#2d2621] rounded text-[#a3978f] hover:text-white transition-colors cursor-pointer bg-transparent border-none"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-vintage-rust" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="timeline-range w-20 cursor-pointer"
          />
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#110d0b] border border-[#2b2420] rounded px-2 py-1">
            <button
              type="button"
              onClick={onTogglePreviewExpanded}
              className="w-6 h-6 rounded bg-transparent border-none text-[#a3978f] hover:text-white hover:bg-[#2d2621] flex items-center justify-center cursor-pointer"
              title={isPreviewExpanded ? "Restore preview layout" : "Enlarge preview area"}
            >
              {isPreviewExpanded ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
            <select
              value={previewZoom}
              onChange={(e) => onPreviewZoomChange(parsePreviewZoom(e.target.value))}
              className="h-6 bg-[#181412] border border-[#3e342c] rounded px-2 text-[10px] font-mono text-[#ded9d5] focus:outline-none focus:border-vintage-gold/60 cursor-pointer"
              title="Preview zoom"
            >
              {previewZoomOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-[#110d0b] border border-[#2b2420] rounded-full px-2.5 py-1">
            <ZoomOut className="w-3.5 h-3.5 text-[#8f8278]" />
            <input
              type="range"
              min="0.5"
              max="4"
              step="0.1"
            value={zoomLevel}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              className="timeline-range w-28 cursor-pointer"
              title="Timeline zoom"
            />
            <ZoomIn className="w-3.5 h-3.5 text-[#8f8278]" />
            <span className="w-8 text-right font-mono text-[9px] text-[#a3978f]">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>

          {/* AI Generator button */}
          <button
            onClick={() => setShowAiModal(true)}
            disabled={isPlaying}
            className={`px-3.5 py-1.5 rounded bg-vintage-gold hover:bg-[#b08138] text-black font-bold text-xs uppercase flex items-center gap-1.5 transition-all hover:scale-[1.02] shadow cursor-pointer border-none ${isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>AI</span>
          </button>

          {/* Render Button */}
          <button
            onClick={onOpenRenderModal}
            disabled={isPlaying}
            className={`px-3.5 py-1.5 rounded bg-[#2b2420] hover:bg-[#3e342c] text-[#ded9d5] hover:text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer border border-[#3e342c] ${isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Render</span>
          </button>
        </div>
      </div>

      {/* Tracks Timeline Visualizer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track Layer Names (Left Pane) */}
        <div className="w-48 border-r border-[#2b2420] bg-[#1a1613] flex flex-col divide-y divide-[#2b2420]/60 select-none shrink-0 font-mono text-[9px] text-[#8f8278] uppercase">
          <div className="h-6 flex items-center px-3 text-[#6b5d53] tracking-widest bg-black/10">
            TRACK LAYER
          </div>
          {videoData.scenes.map((scene, i) => (
            <div
              key={i}
              className="flex-1 flex items-center px-3 bg-[#1a1613] hover:bg-black/10 gap-1.5"
            >
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: videoData.themeColor }}
              />
              <span className="truncate">
                Scene {i + 1} ({scene.type})
              </span>
            </div>
          ))}
        </div>

        {/* Time ruler & Visual tracks container */}
        <div className="flex-1 flex flex-col overflow-x-auto overflow-y-hidden custom-scrollbar bg-[#110d0b] relative">
          {/* Time ruler ticks */}
          <div
            className="h-6 bg-[#161210] border-b border-[#2b2420]/60 relative select-none shrink-0 min-w-full"
            style={{ width: `${timelineWidth}px` }}
          >
            {rulerTicks.map(({ sec, left }) => (
              <div
                key={sec}
                className="absolute top-0 bottom-0 border-l border-[#2b2420]/40 flex flex-col justify-between pl-1"
                style={{ left: `${left}px` }}
              >
                <span className="text-[8px] font-mono text-[#6b5d53]">{sec}s</span>
                <div className="h-1 w-[1px] bg-[#6b5d53]" />
              </div>
            ))}
          </div>

          {/* Visual Blocks representing Scenes */}
          <div
            className="flex-1 flex flex-col divide-y divide-[#2b2420]/60 shrink-0 relative min-w-full"
            style={{ width: `${timelineWidth}px` }}
            onPointerDown={handleTimelinePointerDown}
          >
            {sceneLayout.map(({ scene, startFrame, left, width }, i) => {
              return (
                <div
                  key={i}
                  className={`flex-1 relative flex items-center transition-all ${
                    selectedSceneIndex === i
                      ? "bg-vintage-gold/10"
                      : "bg-[#1f1a17]/10 hover:bg-[#1f1a17]/25"
                  }`}
                >
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onSceneSelect(i, startFrame);
                    }}
                    className="absolute h-8 rounded border flex items-center justify-between px-3 text-[10px] font-semibold text-white shadow-md cursor-pointer transition-all hover:scale-[1.005] hover:brightness-110 active:brightness-95"
                    style={{
                      left: `${left}px`,
                      width: `${width}px`,
                      backgroundColor: `${videoData.themeColor}1a`,
                      borderColor:
                        selectedSceneIndex === i ? "#f6d58b" : videoData.themeColor
                    }}
                  >
                    <span className="truncate pr-2">{scene.title}</span>
                    <span className="text-[8px] font-mono text-[#a3978f] shrink-0">
                      {scene.durationInFrames}f
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Vertical Playhead Line across Ruler & Tracks */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-vintage-gold z-30 pointer-events-none"
              style={{
                left: `${currentFrame * pixelsPerFrame}px`,
                transition: isPlaying ? "none" : "left 0.1s ease"
              }}
            >
              <div className="w-3 h-3 rounded-full bg-vintage-gold border-2 border-black absolute -top-1.5 -left-1" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
