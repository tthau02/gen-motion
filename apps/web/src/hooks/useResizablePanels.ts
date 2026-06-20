import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { PanelSizes, ResizeTarget } from "../components/dashboard/types";

const DEFAULT_PANEL_SIZES: PanelSizes = {
  left: 320,
  right: 320,
  timeline: 224,
};

const COMPACT_PANEL_SIZES: PanelSizes = {
  left: 260,
  right: 260,
  timeline: 168,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const useResizablePanels = () => {
  const [panelSizes, setPanelSizes] = useState<PanelSizes>(DEFAULT_PANEL_SIZES);
  const [resizeTarget, setResizeTarget] = useState<ResizeTarget | null>(null);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const previousPanelSizes = useRef<PanelSizes>(DEFAULT_PANEL_SIZES);
  const resizeStart = useRef({
    target: null as ResizeTarget | null,
    startX: 0,
    startY: 0,
    ...DEFAULT_PANEL_SIZES,
  });

  const beginResize = (
    target: ResizeTarget,
    e: ReactPointerEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    setIsPreviewExpanded(false);
    resizeStart.current = {
      target,
      startX: e.clientX,
      startY: e.clientY,
      ...panelSizes,
    };
    setResizeTarget(target);
  };

  const togglePreviewExpanded = (onExpand?: () => void) => {
    setIsPreviewExpanded((current) => {
      if (current) {
        setPanelSizes(previousPanelSizes.current);
        return false;
      }

      previousPanelSizes.current = panelSizes;
      setPanelSizes(COMPACT_PANEL_SIZES);
      onExpand?.();
      return true;
    });
  };

  useEffect(() => {
    if (!resizeTarget) return;

    const handlePointerMove = (e: PointerEvent) => {
      const start = resizeStart.current;
      const minPreviewWidth = 420;
      const minPreviewHeight = 260;
      const maxSideWidth = Math.min(560, window.innerWidth - minPreviewWidth - 260);
      const maxTimelineHeight = Math.min(420, window.innerHeight - minPreviewHeight - 64);

      setPanelSizes((current) => {
        if (start.target === "left") {
          const nextLeft = clamp(
            start.left + e.clientX - start.startX,
            240,
            Math.max(
              240,
              Math.min(maxSideWidth, window.innerWidth - current.right - minPreviewWidth)
            )
          );
          return { ...current, left: nextLeft };
        }

        if (start.target === "right") {
          const nextRight = clamp(
            start.right - (e.clientX - start.startX),
            260,
            Math.max(
              260,
              Math.min(maxSideWidth, window.innerWidth - current.left - minPreviewWidth)
            )
          );
          return { ...current, right: nextRight };
        }

        const nextTimeline = clamp(
          start.timeline - (e.clientY - start.startY),
          160,
          Math.max(160, maxTimelineHeight)
        );
        return { ...current, timeline: nextTimeline };
      });
    };

    const handlePointerUp = () => setResizeTarget(null);

    document.body.style.cursor =
      resizeTarget === "timeline" ? "ns-resize" : "ew-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [resizeTarget]);

  return {
    panelSizes,
    resizeTarget,
    isPreviewExpanded,
    beginResize,
    togglePreviewExpanded,
  };
};
