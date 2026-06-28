import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const VideoSceneSchema = z.object({
  type: z.string(),
  title: z.string(),
  subtitle: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  imageSearchKeyword: z.string().optional(),
  durationInFrames: z.number().int().min(1),
  effect: z.enum(["fade", "slide-left", "slide-right", "none"]),
  customProps: z
    .object({
      codeSnippet: z.string().optional(),
      terminalCommand: z.string().optional(),
      layoutVariant: z
        .enum(["center", "split", "spotlight", "dashboard"])
        .optional(),
      visualStyle: z
        .enum(["cinematic", "minimal", "technical", "bold"])
        .optional(),
      badgeText: z.string().optional(),
      metricLabel: z.string().optional(),
      metricValue: z.string().optional(),
      chips: z.array(z.string()).optional(),
      shotType: z
        .enum([
          "wide",
          "close-up",
          "detail",
          "editorial",
          "documentary",
          "data-insert",
        ])
        .optional(),
      focalPoint: z.string().optional(),
      captionStyle: z
        .enum(["none", "lower-third", "chapter", "caption", "annotation"])
        .optional(),
      textureLevel: z.enum(["none", "subtle", "medium"]).optional(),
      overlayDensity: z.enum(["none", "low", "medium"]).optional(),
      supportingDetails: z.array(z.string()).optional(),
      narrationText: z.string().optional(),
    })
    .catchall(z.unknown())
    .optional(),
}).catchall(z.unknown());

export const VideoMetadataSchema = z.object({
  themeColor: zColor(),
  textColor: zColor().optional(),
  backgroundColor: zColor().optional(),
  borderColor: zColor().optional(),
  audioUrl: z.string().optional(),
  narrationText: z.string().optional(),
  aspectRatio: z.enum(["16:9", "9:16"]).optional(),
  scenes: z.array(VideoSceneSchema),
});

export type VideoScene = z.infer<typeof VideoSceneSchema>;

export interface VideoMetadata {
  themeColor: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  audioUrl?: string;
  /** Pre-generated Vietnamese voiceover narration text from AI */
  narrationText?: string;
  aspectRatio?: "16:9" | "9:16";
  scenes: VideoScene[];
  [key: string]: unknown;
}
