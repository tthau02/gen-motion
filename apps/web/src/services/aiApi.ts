import { SidebarProject } from "../components/dashboard/types";
import { apiClient } from "../lib/apiClient";

export interface GenerateVideoRequest {
  title: string;
  description: string;
  duration: string;
  tone: string;
  projectId?: string;
  templates?: string[];
}

export const aiApi = {
  async generateVideo(request: GenerateVideoRequest) {
    const response = await apiClient.post<SidebarProject>(
      "/ai/generate",
      request
    );
    return response.data;
  },
};
