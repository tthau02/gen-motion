import { useEffect, useRef, useState } from "react";
import { PreviewZoom } from "../components/dashboard/types";

export const usePreviewSizing = (
  previewZoom: PreviewZoom,
  compositionWidth: number = 1280,
  compositionHeight: number = 720
) => {
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const [fitPreviewSize, setFitPreviewSize] = useState({
    width: 800,
    height: 450,
  });

  useEffect(() => {
    const viewport = previewViewportRef.current;
    if (!viewport) return;

    const updateFitSize = () => {
      const availableWidth = Math.max(1, viewport.clientWidth - 64);
      const availableHeight = Math.max(1, viewport.clientHeight - 64);
      const scale = Math.min(
        availableWidth / compositionWidth,
        availableHeight / compositionHeight
      );

      setFitPreviewSize({
        width: Math.max(160, Math.floor(compositionWidth * scale)),
        height: Math.max(90, Math.floor(compositionHeight * scale)),
      });
    };

    updateFitSize();
    const observer = new ResizeObserver(updateFitSize);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, [compositionWidth, compositionHeight]);

  const previewSize =
    previewZoom === "fit"
      ? fitPreviewSize
      : {
          width: compositionWidth * previewZoom,
          height: compositionHeight * previewZoom,
        };

  return {
    previewViewportRef,
    previewSize,
  };
};
