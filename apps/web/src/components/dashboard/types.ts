import { VideoMetadata } from "../../types";

export interface SidebarProject {
  id: string;
  title: string;
  duration: string;
  durationInFrames: number;
  thumbnail: string;
  data: VideoMetadata;
}

export type LeftTab = "compositions" | "assets" | "projects";
export type RightTab = "props" | "renders";
export type ResizeTarget = "left" | "right" | "timeline";
export type PreviewZoom = "fit" | 0.25 | 0.5 | 1;

export interface PreviewZoomOption {
  label: string;
  value: PreviewZoom;
}

export interface PanelSizes {
  left: number;
  right: number;
  timeline: number;
}
