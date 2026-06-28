/* eslint-disable @remotion/non-pure-animation */
import React, { useState } from "react";
import { Player } from "@remotion/player";
import { MyComposition } from "./Composition";
import { VideoScene } from "./types";
import { AiVideoModal } from "./components/dashboard/AiVideoModal";
import { Header } from "./components/dashboard/Header";
import { RenderModal } from "./components/dashboard/RenderModal";
import { SidebarLeft } from "./components/dashboard/SidebarLeft";
import { SidebarRight } from "./components/dashboard/SidebarRight";
import { Timeline } from "./components/dashboard/Timeline";
import {
  LeftTab,
  PreviewZoom,
  PreviewZoomOption,
  RightTab,
} from "./components/dashboard/types";
import { usePlayerControls } from "./hooks/usePlayerControls";
import { usePreviewSizing } from "./hooks/usePreviewSizing";
import { useProjectLibrary } from "./hooks/useProjectLibrary";
import { useResizablePanels } from "./hooks/useResizablePanels";
import { calculateTotalDuration } from "./utils/videoDuration";
import "./components/dashboard/dashboard-ui.css";

class PlayerErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Player render error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center text-red-400 bg-black/80 w-full h-full">
          <p className="font-semibold text-sm mb-1 text-vintage-gold">
            No video preview
          </p>
          <p className="text-[11px] text-stone-400 max-w-xs mb-3 truncate">
            {this.state.error?.message || "Error decoding image/video"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-2.5 py-1 bg-vintage-gold text-[#14110f] rounded text-xs font-semibold cursor-pointer border-none hover:bg-vintage-gold/90 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const previewZoomOptions: PreviewZoomOption[] = [
  { label: "Fit", value: "fit" },
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "100%", value: 1 },
];

const formatFrameToTime = (frame: number) => {
  const totalSeconds = frame / 30;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 100);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
};

export const App: React.FC = () => {
  const [leftTab, setLeftTab] = useState<LeftTab>("projects");
  const [rightTab, setRightTab] = useState<RightTab>("props");
  const [showAiModal, setShowAiModal] = useState(false);
  const [showRenderModal, setShowRenderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultUpdateCurrent, setDefaultUpdateCurrent] = useState(false);
  const [previewZoom, setPreviewZoom] = useState<PreviewZoom>("fit");

  const {
    panelSizes,
    resizeTarget,
    isPreviewExpanded,
    beginResize,
    togglePreviewExpanded: togglePanelPreviewExpanded,
  } = useResizablePanels();

  const projectLibrary = useProjectLibrary(() => playerControls.resetPlayback());
  const {
    projects,
    videoData,
    activeProject,
    isGenerating,
    isGeneratingVoiceover,
    selectedSceneIndex,
    setSelectedSceneIndex,
    updateCurrentVideoData,
    handleProjectSelect,
    generateAiVideo,
    generateVoiceoverForProject,
  } = projectLibrary;

  const isVerticalRatio = videoData?.aspectRatio === "9:16";
  const compositionWidth = isVerticalRatio ? 720 : 1280;
  const compositionHeight = isVerticalRatio ? 1280 : 720;

  const { previewViewportRef, previewSize } = usePreviewSizing(
    previewZoom,
    compositionWidth,
    compositionHeight
  );

  const totalFrames = calculateTotalDuration(videoData);
  const playerControls = usePlayerControls(totalFrames);
  const {
    playerRef,
    playerInstance,
    setPlayerInstance,
    isPlaying,
    currentFrame,
    isMuted,
    volume,
    handlePlayPause,
    handleSeek,
    handleVolumeChange,
    toggleMute,
  } = playerControls;

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeProjectTitle =
    projects.find((project) => project.id === activeProject)?.title ??
    activeProject;

  const handleNewProject = () => {
    setDefaultUpdateCurrent(false);
    setShowAiModal(true);
  };

  const handleSceneSelect = (index: number, startFrame?: number) => {
    setSelectedSceneIndex(index);
    if (typeof startFrame === "number") {
      handleSeek(startFrame);
    }
  };
 
  const handleAddScene = (type: string) => {
    const newScene: VideoScene = {
      type: type as VideoScene["type"],
      title: `NEW ${type.toUpperCase()} SCENE`,
      subtitle: `Preset ${type} template`,
      description: `This is a newly added ${type} themed scene component. Customize it here.`,
      durationInFrames: 120, // 4 seconds default
      effect: "fade",
      imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1280&h=720&q=80",
      customProps: {
        layoutVariant: "center",
        visualStyle: "cinematic",
        shotType: "editorial",
        captionStyle: "lower-third",
        textureLevel: "subtle",
        overlayDensity: "low",
        focalPoint: `A clear ${type} subject with restrained typography`,
      }
    };
    
    if (type === "react") {
      newScene.customProps!.codeSnippet = "export default function Component() {\n  return <div>React Component</div>;\n}";
    } else if (type === "outro") {
      newScene.customProps!.terminalCommand = "npm run build";
    }
 
    const nextScenes = [...videoData.scenes, newScene];
    updateCurrentVideoData({
      ...videoData,
      scenes: nextScenes,
    });
    
    // Seek to the new scene start frame
    setTimeout(() => {
      let startFrame = 0;
      nextScenes.slice(0, -1).forEach((scene) => {
        startFrame += scene.durationInFrames;
        if (scene.effect !== "none") {
          startFrame -= 10;
        }
      });
      handleSeek(startFrame);
      setSelectedSceneIndex(nextScenes.length - 1);
    }, 100);
  };

  const handleGenerateAiVideo = (
    title: string,
    description: string,
    duration: string,
    tone: string,
    updateCurrent: boolean,
    templates: string[],
    aspectRatio?: "16:9" | "9:16",
    voiceoverOptions?: { enabled: boolean; voiceId?: string },
  ) => {
    generateAiVideo(title, description, duration, tone, updateCurrent, templates, aspectRatio)
      .then((project) => {
        setShowAiModal(false);
        // If voiceover is enabled, generate it after video creation
        if (voiceoverOptions?.enabled && project) {
          generateVoiceoverForProject({
            projectId: project.id,
            videoData: project.data,
            title: project.title,
            description,
            duration,
            tone,
            voiceId: voiceoverOptions.voiceId,
          }).catch((err: Error) => {
            console.error("Error generating voiceover:", err);
            alert(`Lỗi tạo giọng nói: ${err.message}`);
          });
        }
      })
      .catch((err) => {
        console.error("Error generating AI video:", err);
        alert(`Error generating AI video: ${err.message}`);
      });
  };

  const togglePreviewExpanded = () => {
    togglePanelPreviewExpanded(() => setPreviewZoom("fit"));
  };

  return (
    <div className="editor-dashboard-ui h-screen w-screen flex flex-col bg-[#14110f] text-[#ded9d5] select-none overflow-hidden">
      <Header activeProject={activeProject} />

      <main className="flex-1 flex overflow-hidden min-h-0">
        <div
          className="relative shrink-0 min-h-0"
          style={{ width: `${panelSizes.left}px` }}
        >
          <SidebarLeft
            leftTab={leftTab}
            setLeftTab={setLeftTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredProjects={filteredProjects}
            activeProject={activeProject}
            onProjectSelect={handleProjectSelect}
            onNewProject={handleNewProject}
            onAddScene={handleAddScene}
          />
          <div
            onPointerDown={(e) => beginResize("left", e)}
            className={`absolute top-0 right-[-3px] z-40 h-full w-1.5 cursor-ew-resize ${resizeTarget === "left"
              ? "bg-vintage-gold"
              : "bg-transparent hover:bg-vintage-gold/70"
              }`}
            title="Resize left panel"
          />
        </div>

        <section className="flex-1 min-w-0 flex flex-col bg-[#110d0b] relative">
          <div
            ref={previewViewportRef}
            className="flex-1 min-h-0 overflow-auto custom-scrollbar p-8"
          >
            <div className="min-w-full min-h-full flex items-center justify-center">
              <div
                className="rounded-lg overflow-hidden border border-[#3e342c]/60 shadow-2xl relative bg-black flex items-center justify-center shrink-0"
                style={{
                  width: `${previewSize.width}px`,
                  height: `${previewSize.height}px`,
                }}
              >
                <PlayerErrorBoundary>
                  <Player
                    ref={(node) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (playerRef as any).current = node;
                      if (node !== playerInstance) {
                        setPlayerInstance(node);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).playerInstance = node;
                      }
                    }}
                    component={MyComposition}
                    inputProps={videoData}
                    durationInFrames={totalFrames}
                    fps={30}
                    compositionWidth={compositionWidth}
                    compositionHeight={compositionHeight}
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "100%",
                      maxWidth: "100%",
                    }}
                    controls={false}
                    acknowledgeRemotionLicense={true}
                  />
                </PlayerErrorBoundary>
              </div>
            </div>
          </div>
        </section>

        <div
          className="relative shrink-0 min-h-0"
          style={{ width: `${panelSizes.right}px` }}
        >
          <div
            onPointerDown={(e) => beginResize("right", e)}
            className={`absolute top-0 left-[-3px] z-40 h-full w-1.5 cursor-ew-resize ${resizeTarget === "right"
              ? "bg-vintage-gold"
              : "bg-transparent hover:bg-vintage-gold/70"
              }`}
            title="Resize right panel"
          />
          <SidebarRight
            rightTab={rightTab}
            setRightTab={setRightTab}
            videoData={videoData}
            setVideoData={updateCurrentVideoData}
            selectedSceneIndex={selectedSceneIndex}
            onSceneSelect={handleSceneSelect}
            onOpenRenderModal={() => setShowRenderModal(true)}
          />
        </div>
      </main>

      <div
        className="relative shrink-0"
        style={{ height: `${panelSizes.timeline}px` }}
      >
        <div
          onPointerDown={(e) => beginResize("timeline", e)}
          className={`absolute left-0 top-[-3px] z-50 h-1.5 w-full cursor-ns-resize ${resizeTarget === "timeline"
            ? "bg-vintage-gold"
            : "bg-transparent hover:bg-vintage-gold/70"
            }`}
          title="Resize timeline"
        />
        <Timeline
          currentFrame={currentFrame}
          totalFrames={totalFrames}
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          videoData={videoData}
          selectedSceneIndex={selectedSceneIndex}
          previewZoom={previewZoom}
          previewZoomOptions={previewZoomOptions}
          isPreviewExpanded={isPreviewExpanded}
          onPreviewZoomChange={setPreviewZoom}
          onTogglePreviewExpanded={togglePreviewExpanded}
          formatFrameToTime={formatFrameToTime}
          handleSeek={handleSeek}
          onSceneSelect={handleSceneSelect}
          handlePlayPause={handlePlayPause}
          toggleMute={toggleMute}
          handleVolumeChange={handleVolumeChange}
          setShowAiModal={(show) => {
            if (show) {
              setDefaultUpdateCurrent(true);
            }
            setShowAiModal(show);
          }}
          onOpenRenderModal={() => setShowRenderModal(true)}
        />
      </div>

      <AiVideoModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onGenerate={handleGenerateAiVideo}
        isGenerating={isGenerating || isGeneratingVoiceover}
        defaultUpdateCurrent={defaultUpdateCurrent}
      />

      <RenderModal
        isOpen={showRenderModal}
        onClose={() => setShowRenderModal(false)}
        projectId={activeProject}
        title={activeProjectTitle}
        videoData={videoData}
      />
    </div>
  );
};
