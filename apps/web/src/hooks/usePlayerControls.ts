import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { PlayerRef } from "@remotion/player";

export const usePlayerControls = (totalFrames: number) => {
  const playerRef = useRef<PlayerRef>(null);
  const [playerInstance, setPlayerInstance] = useState<PlayerRef | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (currentFrame > totalFrames - 1) {
      handleSeek(totalFrames - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalFrames]);

  useEffect(() => {
    if (!playerInstance) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const player = playerInstance as any;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onFrameUpdate = (e: CustomEvent<{ frame: number }>) => {
      setCurrentFrame(e.detail?.frame ?? player.getCurrentFrame());
    };

    try {
      player.addEventListener("play", onPlay);
      player.addEventListener("pause", onPause);
      player.addEventListener("frameupdate", onFrameUpdate as EventListener);
      setIsPlaying(player.isPlaying());
      setCurrentFrame(player.getCurrentFrame());
    } catch (err) {
      console.warn("Failed to attach event listeners:", err);
    }

    return () => {
      try {
        player.removeEventListener("play", onPlay);
        player.removeEventListener("pause", onPause);
        player.removeEventListener("frameupdate", onFrameUpdate as EventListener);
      } catch {
        // Safe cleanup
      }
    };
  }, [playerInstance]);

  const handlePlayPause = () => {
    try {
      if (isPlaying) {
        playerRef.current?.pause();
      } else {
        playerRef.current?.play();
      }
    } catch (err) {
      console.warn("Failed to toggle play/pause:", err);
    }
  };

  const handleSeek = (frame: number) => {
    try {
      const safeFrame = Math.max(0, Math.min(totalFrames - 1, frame));
      playerRef.current?.seekTo(safeFrame);
      setCurrentFrame(safeFrame);
    } catch (err) {
      console.warn("Failed to seek to frame:", err);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const val = parseFloat(e.target.value);
      setVolume(val);
      playerRef.current?.setVolume(val);
      setIsMuted(val === 0);
    } catch (err) {
      console.warn("Failed to set volume:", err);
    }
  };

  const toggleMute = () => {
    try {
      if (isMuted) {
        playerRef.current?.setVolume(volume || 0.5);
        setIsMuted(false);
      } else {
        playerRef.current?.setVolume(0);
        setIsMuted(true);
      }
    } catch (err) {
      console.warn("Failed to toggle mute:", err);
    }
  };

  const resetPlayback = (delay = 100) => {
    window.setTimeout(() => {
      playerRef.current?.seekTo(0);
      setCurrentFrame(0);
    }, delay);
  };

  return {
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
    resetPlayback,
  };
};
