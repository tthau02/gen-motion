import { useEffect, useRef, useState } from "react";
import { PreviewZoom } from "../components/dashboard/types";

export const usePreviewSizing = (previewZoom: PreviewZoom) => {
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
      const scale = Math.min(availableWidth / 1280, availableHeight / 720);

      setFitPreviewSize({
        width: Math.max(160, Math.floor(1280 * scale)),
        height: Math.max(90, Math.floor(720 * scale)),
      });
    };

    updateFitSize();
    const observer = new ResizeObserver(updateFitSize);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, []);

  const previewSize =
    previewZoom === "fit"
      ? fitPreviewSize
      : {
          width: 1280 * previewZoom,
          height: 720 * previewZoom,
        };

  return {
    previewViewportRef,
    previewSize,
  };
};
