import { VideoMetadata } from "../types";
import { SidebarProject } from "../components/dashboard/types";
import { apiClient } from "../lib/apiClient";

export const projectsApi = {
  async list() {
    const response = await apiClient.get<SidebarProject[]>("/projects");
    return response.data;
  },

  async update(projectId: string, data: VideoMetadata) {
    const response = await apiClient.post<SidebarProject>(
      `/projects/${projectId}`,
      data
    );
    return response.data;
  },
};
