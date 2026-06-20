import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const VideoSceneSchema = z.object({
  type: z.string(),
  title: z.string(),
  subtitle: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
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
  scenes: z.array(VideoSceneSchema),
});

export type VideoScene = z.infer<typeof VideoSceneSchema>;

export interface VideoMetadata extends z.infer<typeof VideoMetadataSchema> {
  [key: string]: unknown;
}
