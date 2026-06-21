/* eslint-disable @remotion/non-pure-animation */
import React, { useEffect, useState } from "react";
import { Download, Loader2, Play, Video, X } from "lucide-react";
import { VideoMetadata } from "../../types";
import { renderApi, RenderJob, RenderResolution } from "../../services/renderApi";

const resolutionOptions: {
  value: RenderResolution;
  label: string;
  size: string;
}[] = [
    { value: "720p", label: "HD 720p", size: "1280x720" },
    { value: "1080p", label: "Full HD 1080p", size: "1920x1080" },
    { value: "1440p", label: "QHD 1440p", size: "2560x1440" },
    { value: "4k", label: "UHD 4K", size: "3840x2160" },
  ];

interface RenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  title: string;
  videoData: VideoMetadata;
}

export const RenderModal: React.FC<RenderModalProps> = ({
  isOpen,
  onClose,
  projectId,
  title,
  videoData,
}) => {
  const [job, setJob] = useState<RenderJob | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [resolution, setResolution] = useState<RenderResolution>("720p");
  const [outputDirectory, setOutputDirectory] = useState("renders");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && job?.status !== "rendering") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, job?.status]);

  useEffect(() => {
    if (!isOpen || !job || job.status === "done" || job.status === "error") {
      return;
    }

    const timer = window.setInterval(() => {
      renderApi
        .getJob(job.id)
        .then((nextJob) => setJob(nextJob))
        .catch((err) =>
          setJob((current) =>
            current
              ? {
                ...current,
                status: "error",
                message: "Render status polling failed",
                error: err instanceof Error ? err.message : String(err),
              }
              : current
          )
        );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, job]);

  useEffect(() => {
    if (!isOpen) {
      setJob(null);
      setIsStarting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && job?.status !== "rendering") {
      onClose();
    }
  };

  const startRender = () => {
    setIsStarting(true);
    renderApi
      .start({
        projectId,
        title,
        data: videoData,
        resolution,
        outputDirectory,
      })
      .then((createdJob) => setJob(createdJob))
      .catch((err) =>
        setJob({
          id: "local-error",
          status: "error",
          progress: 0,
          message: "Render start failed",
          error: err instanceof Error ? err.message : String(err),
        })
      )
      .finally(() => setIsStarting(false));
  };

  const progressPercent = Math.round((job?.progress ?? 0) * 100);
  const isRunning =
    isStarting ||
    job?.status === "queued" ||
    job?.status === "bundling" ||
    job?.status === "rendering";
  const selectedResolution = resolutionOptions.find(
    (option) => option.value === resolution
  );

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] p-4 transition-all animate-fade-in"
    >
      <div className="w-full max-w-[680px] bg-[#1a1613] rounded-xl border border-vintage-gold/30 shadow-2xl overflow-hidden flex flex-col">
        <div className="h-12 border-b border-[#3e342c]/60 bg-black/40 flex items-center justify-between px-5 shrink-0 animate-slide-down">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-vintage-gold" />
            <span className="font-semibold text-xs tracking-wider text-vintage-gold uppercase">
              Render Video
            </span>
          </div>
          <button
            onClick={onClose}
            disabled={job?.status === "rendering"}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-[#a3978f] hover:text-white cursor-pointer bg-transparent border-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div className="rounded border border-[#3e342c]/50 bg-black/25 p-4 flex flex-col gap-2">
            <span className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider">
              Active Project
            </span>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-[11px] text-[#a3978f] font-mono">
                  {videoData.scenes.length} scenes | {selectedResolution?.size} | H.264 MP4
                </p>
              </div>
              <button
                onClick={startRender}
                disabled={isRunning}
                className="px-4 py-2 rounded bg-vintage-gold hover:bg-[#b08138] text-black font-bold text-xs uppercase flex items-center gap-2 transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>{job ? "Render Again" : "Start Render"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[180px_1fr] gap-3 rounded border border-[#3e342c]/50 bg-[#110d0b] p-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider">
                Resolution
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as RenderResolution)}
                disabled={isRunning}
                className="h-9 bg-[#181412] border border-[#3e342c] rounded px-2 text-xs text-white focus:outline-none focus:border-vintage-gold/60 cursor-pointer disabled:opacity-50"
              >
                {resolutionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider">
                Save folder
              </label>
              <input
                value={outputDirectory}
                onChange={(e) => setOutputDirectory(e.target.value)}
                disabled={isRunning}
                placeholder="renders or D:\\Exports"
                className="h-9 bg-[#181412] border border-[#3e342c] rounded px-3 text-xs text-white placeholder-[#6b5d53] focus:outline-none focus:border-vintage-gold/60 disabled:opacity-50"
              />
              <span className="text-[10px] text-[#8f8278] font-mono">
                Relative paths are saved from the project root. Absolute paths save directly on this machine.
              </span>
            </div>
          </div>

          <div className="rounded border border-[#3e342c]/50 bg-[#110d0b] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#8f8278] uppercase font-mono tracking-wider">
                Status
              </span>
              <span className="text-[10px] text-vintage-gold uppercase font-mono">
                {job?.status ?? "ready"}
              </span>
            </div>

            <div className="h-2 rounded bg-[#2b2420] overflow-hidden">
              <div
                className="h-full bg-vintage-gold transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-[11px] font-mono">
              <span className="text-[#a3978f]">
                {job?.message ?? "Ready to render via Remotion renderer"}
              </span>
              <span className="text-white">{progressPercent}%</span>
            </div>

            {job?.error && (
              <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                {job.error}
              </div>
            )}

            {job?.status === "done" && job.outputUrl && (
              <div className="flex flex-col gap-2">
                {job.outputLocation && (
                  <span className="text-[10px] text-[#8f8278] font-mono break-all">
                    Saved to: {job.outputLocation}
                  </span>
                )}
                <a
                  href={
                    job.outputUrl.startsWith("http")
                      ? job.outputUrl
                      : `${import.meta.env.VITE_API_URL || ""}${job.outputUrl}`
                  }
                  download={job.filename}
                  className="w-full py-2 rounded bg-[#2b2420] hover:bg-[#3e342c] text-[#ded9d5] hover:text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all border border-[#3e342c]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
