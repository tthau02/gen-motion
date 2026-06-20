import { VideoMetadata } from "../types";

export const calculateTotalDuration = (data: VideoMetadata) => {
  let total = 0;
  const scenes = data.scenes || [];
  scenes.forEach((scene, index) => {
    total += scene.durationInFrames;
    const isLast = index === scenes.length - 1;
    if (!isLast && scene.effect !== "none") {
      total -= 10;
    }
  });
  return total || 900;
};
