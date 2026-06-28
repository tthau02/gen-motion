import { VideoMetadata, VideoScene } from "../types";

const FPS = 30;
const MIN_SCENE_FRAMES = 45;
const TRANSITION_FRAMES = 10;

const countWords = (text: string) =>
  text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

const splitSentences = (text: string) => {
  const matches = text
    .replace(/\s+/g, " ")
    .trim()
    .match(/[^.!?。！？]+[.!?。！？]?/g);
  return matches?.map((sentence) => sentence.trim()).filter(Boolean) ?? [];
};

const getSceneNarrationText = (
  scene: VideoScene,
  fallbackSentences: string[],
) => {
  const narrationText = scene.customProps?.narrationText;
  if (typeof narrationText === "string" && narrationText.trim()) {
    return narrationText;
  }

  if (fallbackSentences.length > 0) {
    return fallbackSentences.join(" ");
  }

  return [scene.title, scene.subtitle, scene.description]
    .filter(Boolean)
    .join(" ");
};

const distributeSentencesAcrossScenes = (
  narrationText: string,
  sceneCount: number,
) => {
  const sentences = splitSentences(narrationText);
  if (sceneCount === 0) return [];
  if (sentences.length === 0) return Array.from({ length: sceneCount }, () => []);

  const groups = Array.from({ length: sceneCount }, () => [] as string[]);
  const totalWords = Math.max(1, countWords(narrationText));
  const targetWordsPerScene = totalWords / sceneCount;
  let sceneIndex = 0;
  let sceneWords = 0;

  for (const sentence of sentences) {
    const sentenceWords = Math.max(1, countWords(sentence));
    const shouldMoveToNextScene =
      sceneIndex < sceneCount - 1 &&
      groups[sceneIndex].length > 0 &&
      sceneWords + sentenceWords > targetWordsPerScene;

    if (shouldMoveToNextScene) {
      sceneIndex += 1;
      sceneWords = 0;
    }

    groups[sceneIndex].push(sentence);
    sceneWords += sentenceWords;
  }

  return groups;
};

export const alignSceneDurationsToNarration = (
  data: VideoMetadata,
  narrationText: string,
  audioDurationSeconds?: number,
): VideoMetadata => {
  const scenes = data.scenes ?? [];
  if (scenes.length === 0) {
    return data;
  }

  const targetTimelineFrames = Math.max(
    scenes.length * MIN_SCENE_FRAMES,
    Math.round((audioDurationSeconds || 0) * FPS) ||
      scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0),
  );
  const transitionOverlapFrames = scenes.reduce((sum, scene, index) => {
    const isLast = index === scenes.length - 1;
    return sum + (!isLast && scene.effect !== "none" ? TRANSITION_FRAMES : 0);
  }, 0);
  const targetSceneFrames = targetTimelineFrames + transitionOverlapFrames;
  const sentenceGroups = distributeSentencesAcrossScenes(
    narrationText,
    scenes.length,
  );
  const weights = scenes.map((scene, index) =>
    Math.max(
      1,
      countWords(getSceneNarrationText(scene, sentenceGroups[index] ?? [])),
    ),
  );
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0) || 1;

  let assignedFrames = 0;
  const timedScenes = scenes.map((scene, index) => {
    const isLast = index === scenes.length - 1;
    const remainingScenes = scenes.length - index - 1;
    const rawDuration = isLast
      ? targetSceneFrames - assignedFrames
      : Math.round((targetSceneFrames * weights[index]) / totalWeight);
    const maxAllowed =
      targetSceneFrames - assignedFrames - remainingScenes * MIN_SCENE_FRAMES;
    const durationInFrames = Math.max(
      MIN_SCENE_FRAMES,
      Math.min(rawDuration, maxAllowed),
    );
    assignedFrames += durationInFrames;

    return {
      ...scene,
      durationInFrames,
    };
  });

  return {
    ...data,
    narrationText,
    scenes: timedScenes,
  };
};
