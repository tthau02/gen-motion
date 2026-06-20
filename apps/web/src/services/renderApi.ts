import { VideoMetadata } from "../types";
import { apiClient } from "../lib/apiClient";

export type RenderStatus = "queued" | "bundling" | "rendering" | "done" | "error";
export type RenderResolution = "720p" | "1080p" | "1440p" | "4k";

export interface RenderJob {
  id: string;
  status: RenderStatus;
  progress: number;
  message: string;
  outputUrl?: string;
  filename?: string;
  outputLocation?: string;
  error?: string;
}

export interface StartRenderRequest {
  projectId: string;
  title: string;
  data: VideoMetadata;
  resolution: RenderResolution;
  outputDirectory: string;
}

export const renderApi = {
  async start(request: StartRenderRequest) {
    const response = await apiClient.post<RenderJob>("/render", request);
    return response.data;
  },

  async getJob(jobId: string) {
    const response = await apiClient.get<RenderJob>(`/render/${jobId}`);
    return response.data;
  },
};
