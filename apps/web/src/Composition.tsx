import React from "react";
import { Audio } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AestheticContainer } from "./components/AestheticContainer";
import { SceneDirectorOverlay } from "./components/SceneDirectorOverlay";
import { VideoMetadata } from "./types";

// Import modular scenes
import { SceneIntro } from "./scenes/SceneIntro";
import { SceneReact } from "./scenes/SceneReact";
import { ScenePrecision } from "./scenes/ScenePrecision";
import { SceneAudio } from "./scenes/SceneAudio";
import { SceneScale } from "./scenes/SceneScale";
import { SceneTransitions } from "./scenes/SceneTransitions";
import { ScenePerformance } from "./scenes/ScenePerformance";
import { SceneOutro } from "./scenes/SceneOutro";

// =========================================================================
// MAIN COMPOSITION
// =========================================================================
export const MyComposition: React.FC<VideoMetadata> = ({
  themeColor = "#c89547",
  audioUrl,
  scenes = [],
}) => {
  return (
    <AestheticContainer themeColor={themeColor}>
      {audioUrl && <Audio src={audioUrl} volume={0.5} />}

      <TransitionSeries>
        {scenes.map((scene, index) => {
          const isLast = index === scenes.length - 1;

          // Select appropriate component based on type
          let component = null;
          switch (scene.type) {
            case "intro":
              component = (
                <SceneIntro
                  title={scene.title}
                  subtitle={scene.subtitle}
                  description={scene.description}
                  imageUrl={scene.imageUrl}
                />
              );
              break;
            case "react":
              component = (
                <SceneReact
                  title={scene.title}
                  subtitle={scene.subtitle}
                  description={scene.description}
                  imageUrl={scene.imageUrl}
                  codeSnippet={scene.customProps?.codeSnippet}
                />
              );
              break;
            case "precision":
              component = (
                <ScenePrecision
                  title={scene.title}
                  subtitle={scene.subtitle}
                  description={scene.description}
                  imageUrl={scene.imageUrl}
                />
              );
              break;
            case "audio":
              component = (
                <SceneAudio
                  title={scene.title}
                  subtitle={scene.subtitle}
                  description={scene.description}
                  imageUrl={scene.imageUrl}
                />
              );
              break;
            case "scale":
              component = (
                <SceneScale
                  title={scene.title}
                  subtitle={scene.subtitle}
                  description={scene.description}
                  imageUrl={scene.imageUrl}
                />
              );
              break;
            case "transitions":
              component = (
                <SceneTransitions
                  title={scene.title}
                  subtitle={scene.subtitle}
                  description={scene.description}
                  imageUrl={scene.imageUrl}
                />
              );
              break;
            case "performance":
              component = (
                <ScenePerformance
                  title={scene.title}
                  subtitle={scene.subtitle}
                  description={scene.description}
                  imageUrl={scene.imageUrl}
                />
              );
              break;
            case "outro":
              component = (
                <SceneOutro
                  title={scene.title}
                  subtitle={scene.subtitle}
                  description={scene.description}
                  imageUrl={scene.imageUrl}
                  terminalCommand={scene.customProps?.terminalCommand}
                />
              );
              break;
            default:
              component = null;
          }

          // Transition settings
          let presentation = fade();
          if (scene.effect === "slide-left") {
            presentation = slide({ direction: "from-right" });
          } else if (scene.effect === "slide-right") {
            presentation = slide({ direction: "from-left" });
          }

          return (
            <React.Fragment key={index}>
              <TransitionSeries.Sequence durationInFrames={scene.durationInFrames}>
                <>
                  {component}
                  <SceneDirectorOverlay
                    customProps={scene.customProps}
                    themeColor={themeColor}
                  />
                </>
              </TransitionSeries.Sequence>

              {!isLast && scene.effect !== "none" && (
                <TransitionSeries.Transition
                  presentation={presentation}
                  timing={linearTiming({ durationInFrames: 10 })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AestheticContainer>
  );
};
