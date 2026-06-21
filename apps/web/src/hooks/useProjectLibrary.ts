import { useCallback, useEffect, useRef, useState } from "react";
import { VideoMetadata } from "../types";
import defaultVideoData from "../video-schema.json";
import { SidebarProject } from "../components/dashboard/types";
import { calculateTotalDuration } from "../utils/videoDuration";
import { projectsApi } from "../services/projectsApi";
import { aiApi } from "../services/aiApi";

export const useProjectLibrary = (onPlaybackReset: () => void) => {
  const [projects, setProjects] = useState<SidebarProject[]>([]);
  const [videoData, setVideoData] = useState<VideoMetadata>(
    defaultVideoData as VideoMetadata
  );
  const [activeProject, setActiveProject] = useState("vintage-cinematic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const lastSavedProjectData = useRef<Record<string, string>>({});
  const videoDataRef = useRef(videoData);
  const activeProjectRef = useRef(activeProject);

  useEffect(() => {
    videoDataRef.current = videoData;
  }, [videoData]);

  useEffect(() => {
    activeProjectRef.current = activeProject;
  }, [activeProject]);

  const saveProject = useCallback(async (projectId: string, data: VideoMetadata) => {
    const serialized = JSON.stringify(data);
    if (lastSavedProjectData.current[projectId] === serialized) {
      return null;
    }

    const updatedProject = await projectsApi.update(projectId, data);
    lastSavedProjectData.current[projectId] = JSON.stringify(updatedProject.data);
    setProjects((prev) =>
      prev.map((project) => (project.id === projectId ? updatedProject : project))
    );
    return updatedProject;
  }, []);

  const updateCurrentVideoData = useCallback((nextData: VideoMetadata) => {
    const projectId = activeProjectRef.current;
    setVideoData(nextData);
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              data: nextData,
              durationInFrames: calculateTotalDuration(nextData),
            }
          : project
      )
    );
  }, []);

  useEffect(() => {
    projectsApi
      .list()
      .then((data) => {
        setProjects(data);
        lastSavedProjectData.current = data.reduce(
          (acc: Record<string, string>, project: SidebarProject) => {
            acc[project.id] = JSON.stringify(project.data);
            return acc;
          },
          {}
        );

        const activeProjectData = data.find(
          (project) => project.id === activeProjectRef.current
        );
        if (activeProjectData) {
          setVideoData(activeProjectData.data);
        } else if (data.length > 0) {
          setActiveProject(data[0].id);
          setVideoData(data[0].data);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    if (!activeProject || !videoData || projects.length === 0) return;
    if (lastSavedProjectData.current[activeProject] === JSON.stringify(videoData)) {
      return;
    }

    const timer = window.setTimeout(() => {
      saveProject(activeProject, videoData).catch((err) =>
        console.error("Error auto-saving project:", err)
      );
    }, 500);

    return () => window.clearTimeout(timer);
  }, [videoData, activeProject, projects.length, saveProject]);

  useEffect(() => {
    if (selectedSceneIndex > videoData.scenes.length - 1) {
      setSelectedSceneIndex(Math.max(0, videoData.scenes.length - 1));
    }
  }, [selectedSceneIndex, videoData.scenes.length]);

  const handleProjectSelect = (project: SidebarProject) => {
    const currentProjectId = activeProjectRef.current;
    const currentData = videoDataRef.current;
    if (
      currentProjectId &&
      currentProjectId !== project.id &&
      lastSavedProjectData.current[currentProjectId] !== JSON.stringify(currentData)
    ) {
      saveProject(currentProjectId, currentData).catch((err) =>
        console.error("Error saving before project switch:", err)
      );
    }

    setActiveProject(project.id);
    setVideoData(project.data as VideoMetadata);
    setSelectedSceneIndex(0);
    onPlaybackReset();
  };

  const handleSceneSelect = (index: number, startFrame?: number) => {
    setSelectedSceneIndex(index);
    return startFrame;
  };

  const generateAiVideo = async (
    title: string,
    description: string,
    duration: string,
    tone: string,
    updateCurrent: boolean,
    templates?: string[],
    aspectRatio?: "16:9" | "9:16"
  ) => {
    setIsGenerating(true);
    try {
      const newProject = await aiApi.generateVideo({
        title,
        description,
        duration,
        tone,
        projectId: updateCurrent && activeProject ? activeProject : undefined,
        templates,
        aspectRatio,
      });

      lastSavedProjectData.current[newProject.id] = JSON.stringify(newProject.data);
      if (updateCurrent && activeProject) {
        setProjects((prev) =>
          prev.map((project) => (project.id === activeProject ? newProject : project))
        );
      } else {
        setProjects((prev) => [...prev, newProject]);
        setActiveProject(newProject.id);
      }

      setVideoData(newProject.data);
      setSelectedSceneIndex(0);
      onPlaybackReset();
      return newProject;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    projects,
    videoData,
    activeProject,
    isGenerating,
    selectedSceneIndex,
    setSelectedSceneIndex,
    updateCurrentVideoData,
    handleProjectSelect,
    handleSceneSelect,
    generateAiVideo,
  };
};
