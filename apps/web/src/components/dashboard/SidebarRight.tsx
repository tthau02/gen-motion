/* eslint-disable @remotion/non-pure-animation */
import React from "react";
import { Settings, Zap } from "lucide-react";
import { VideoMetadata, VideoScene } from "../../types";
import { RightTab } from "./types";

interface SidebarRightProps {
  rightTab: RightTab;
  setRightTab: (tab: RightTab) => void;
  videoData: VideoMetadata;
  setVideoData: (data: VideoMetadata) => void;
  selectedSceneIndex: number;
  onSceneSelect: (index: number) => void;
  onOpenRenderModal: () => void;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({
  rightTab,
  setRightTab,
  videoData,
  setVideoData,
  selectedSceneIndex,
  onSceneSelect,
  onOpenRenderModal
}) => {
  const updateSceneField = (idx: number, field: keyof VideoScene, value: string) => {
    const newScenes = [...videoData.scenes];
    newScenes[idx] = { ...newScenes[idx], [field]: value } as VideoScene;
    setVideoData({ ...videoData, scenes: newScenes });
  };

  return (
    <section className="w-full h-full border-l border-[#2b2420] flex flex-col bg-[#181412] shrink-0">
      {/* Tabs */}
      <div className="h-11 border-b border-[#2b2420] flex items-center bg-[#1c1815] p-1 gap-1 shrink-0">
        <button
          onClick={() => setRightTab("props")}
          className={`flex-1 py-1.5 rounded flex items-center justify-center gap-1.5 text-xs font-medium transition-all cursor-pointer bg-transparent border-none ${rightTab === "props"
              ? "bg-[#2d2621] text-vintage-gold"
              : "text-[#8f8278] hover:text-white"
            }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Props</span>
        </button>
        <button
          onClick={() => setRightTab("renders")}
          className={`flex-1 py-1.5 rounded flex items-center justify-center gap-1.5 text-xs font-medium transition-all cursor-pointer bg-transparent border-none ${rightTab === "renders"
              ? "bg-[#2d2621] text-vintage-gold"
              : "text-[#8f8278] hover:text-white"
            }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Renders</span>
        </button>
      </div>

      {/* Properties Panel */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
        {rightTab === "props" && (
          <>
            {/* Theme color customizer */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider">
                Accent Theme Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={videoData.themeColor}
                  onChange={(e) => setVideoData({ ...videoData, themeColor: e.target.value })}
                  className="w-8 h-8 rounded border border-[#3e342c] bg-transparent cursor-pointer"
                />
                <span className="font-mono text-xs uppercase text-white">
                  {videoData.themeColor}
                </span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#2b2420]" />

            {/* Scenes customization list */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider">
                Scenes List
              </span>

              {videoData.scenes.map((scene, idx) => (
                <div
                  key={idx}
                  onClick={() => onSceneSelect(idx)}
                  className={`p-3 rounded border flex flex-col gap-2.5 cursor-pointer transition-colors ${
                    selectedSceneIndex === idx
                      ? "bg-vintage-gold/10 border-vintage-gold/50"
                      : "bg-[#1e1916]/40 border-[#3e342c]/30 hover:border-[#52443a]"
                  }`}
                >
                  <div className="flex justify-between items-center border-b border-[#3e342c]/40 pb-1.5">
                    <span className="font-bold text-xs text-vintage-gold capitalize">
                      Scene {idx + 1}: {scene.type}
                    </span>
                    <span className="text-[9px] font-mono text-[#8f8278]">
                      {scene.durationInFrames} frames
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] text-[#8f8278] uppercase font-mono">Title</label>
                    <input
                      type="text"
                      value={scene.title}
                      onChange={(e) => updateSceneField(idx, "title", e.target.value)}
                      className="bg-[#110d0b] border border-[#2b2420] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-vintage-gold/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] text-[#8f8278] uppercase font-mono">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={scene.subtitle}
                      onChange={(e) => updateSceneField(idx, "subtitle", e.target.value)}
                      className="bg-[#110d0b] border border-[#2b2420] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-vintage-gold/50"
                    />
                  </div>

                  {scene.description !== undefined && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-[#8f8278] uppercase font-mono">
                        Description
                      </label>
                      <textarea
                        value={scene.description}
                        onChange={(e) => updateSceneField(idx, "description", e.target.value)}
                        className="bg-[#110d0b] border border-[#2b2420] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-vintage-gold/50 resize-none h-14 leading-normal"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {rightTab === "renders" && (
          <div className="flex-1 flex flex-col h-full gap-3 p-1">
            {/* Info and trigger */}
            <div className="p-3.5 bg-[#1e1916]/40 rounded-lg border border-[#3e342c]/30 flex flex-col gap-2.5">
              <span className="text-[10px] text-vintage-gold uppercase font-mono tracking-wider font-bold">
                Remotion Renderer
              </span>
              <p className="text-[11px] text-[#a3978f] leading-relaxed font-light font-sans">
                Render the current edited project through the backend Remotion renderer and export an MP4 file.
              </p>
              <button
                onClick={onOpenRenderModal}
                className="w-full py-2 rounded bg-vintage-gold hover:bg-[#b08138] text-black font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none hover:scale-[1.01]"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Open Render Panel</span>
              </button>
            </div>

            <div className="flex-1 min-h-[300px] rounded-lg border border-[#2b2420] bg-black/30 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#8f8278]">
                <span>Output</span>
                <span className="text-vintage-gold">H.264 MP4</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#8f8278]">
                <span>Size</span>
                <span className="text-white">1280x720</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#8f8278]">
                <span>FPS</span>
                <span className="text-white">30</span>
              </div>
              <p className="text-[11px] text-[#a3978f] leading-relaxed mt-2">
                Open the render panel to start an async render job, watch progress, and download the generated video.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
