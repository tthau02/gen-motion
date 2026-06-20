import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';
import { ProjectsService } from '../projects/projects.service';
import { SidebarProject, VideoScene } from '../types';

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly projectsService: ProjectsService) {
    // Initialize Google Gen AI client with environment variable key
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  async generateVideo(
    title: string,
    description: string,
    duration: string,
    tone: string,
    projectId?: string,
  ): Promise<SidebarProject> {
    const durationNum = parseInt(duration) || 10; // default 10 seconds
    const fps = 30;
    const totalFramesNeeded = durationNum * fps;

    const prompt = `
You are a creative video director. Generate a structured multi-scene video configuration based on the following user input:
- Title/Topic: ${title}
- Prompt/Description: ${description}
- Desired Duration: ${durationNum} seconds
- Theme Tone: ${tone}

Total frames target: ${totalFramesNeeded} frames (at 30 frames per second).
You must divide the total duration of ${totalFramesNeeded} frames into a logical sequence of individual scenes.
You should generate between 3 to 6 scenes depending on the topic.
The sum of the scene durations should equal roughly ${totalFramesNeeded} frames (each scene durationInFrames should typically be between 90 and 180 frames).

Guidelines for generating each scene:
1. Each scene has a 'type' from this enum: ['intro', 'react', 'precision', 'audio', 'scale', 'transitions', 'performance', 'outro'].
2. Provide a short, uppercase, punchy title ('title') and a supportive 'subtitle' in Vietnamese.
3. Write a brief, high-quality, engaging scene description ('description') in Vietnamese (1-2 sentences).
4. For image Url ('imageUrl'), choose one of the following high-quality static Unsplash URLs that best matches the scene context:
   - For technical/programming/code/react scenes: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1280&h=720&q=80'
   - For database/server/performance/infrastructure: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1280&h=720&q=80'
   - For music/sound/audio wave: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1280&h=720&q=80'
   - For business/precision/accuracy/timer: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1280&h=720&q=80'
   - For futuristic networks/internet/scale/space: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1280&h=720&q=80'
   - For UI design/layout/react components: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1280&h=720&q=80'
   - For transition/cine filters: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1280&h=720&q=80'
   - For intro/outro/general: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1280&h=720&q=80'
5. Set an transition 'effect' for each scene (except the last scene which must have 'none'): 'fade', 'slide-left', 'slide-right' or 'none'.
6. If the scene type is 'react', fill 'customProps.codeSnippet' with a simple, illustrative React functional component code snippet relevant to the topic.
7. If the scene type is 'outro', fill 'customProps.terminalCommand' with a relevant terminal command like 'npm run build' or 'npx create-video@latest'.
8. For every scene, use 'customProps' to direct the rendered UI to match the user's topic:
   - layoutVariant: choose 'center', 'split', 'spotlight', or 'dashboard'.
   - visualStyle: choose 'cinematic', 'minimal', 'technical', or 'bold'.
   - badgeText: short uppercase label for the scene category.
   - metricLabel and metricValue: a short insight/stat when useful, for example "ENGAGEMENT" and "+42%".
   - chips: 2 to 4 short keywords that should appear as UI chips. Keep each chip under 18 characters.
These UI directions must be content-specific, not generic. For example, a product launch should use launch/product chips; a finance video should use growth/risk/market chips; a learning video should use steps/outcomes chips.

Assign a hex color to 'themeColor' matching the tone:
- Tone 'Lively' -> gold ('#c89547')
- Tone 'Retro' -> rust/red ('#a84a32')
- Tone 'Cool' / others -> blue ('#0284c7')
`;

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not defined');
      }

      // Call Google Gen AI SDK using structured JSON schema format
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              themeColor: { type: Type.STRING },
              scenes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: {
                      type: Type.STRING,
                      enum: [
                        'intro',
                        'react',
                        'precision',
                        'audio',
                        'scale',
                        'transitions',
                        'performance',
                        'outro',
                      ],
                    },
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    description: { type: Type.STRING },
                    imageUrl: { type: Type.STRING },
                    durationInFrames: { type: Type.INTEGER },
                    effect: {
                      type: Type.STRING,
                      enum: ['fade', 'slide-left', 'slide-right', 'none'],
                    },
                    customProps: {
                      type: Type.OBJECT,
                      properties: {
                        codeSnippet: { type: Type.STRING },
                        terminalCommand: { type: Type.STRING },
                        layoutVariant: {
                          type: Type.STRING,
                          enum: ['center', 'split', 'spotlight', 'dashboard'],
                        },
                        visualStyle: {
                          type: Type.STRING,
                          enum: ['cinematic', 'minimal', 'technical', 'bold'],
                        },
                        badgeText: { type: Type.STRING },
                        metricLabel: { type: Type.STRING },
                        metricValue: { type: Type.STRING },
                        chips: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                      },
                    },
                  },
                  required: [
                    'type',
                    'title',
                    'subtitle',
                    'description',
                    'imageUrl',
                    'durationInFrames',
                    'effect',
                  ],
                },
              },
            },
            required: ['themeColor', 'scenes'],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Received empty text from Gemini models');
      }

      const generatedData = JSON.parse(responseText) as {
        themeColor: string;
        scenes: VideoScene[];
      };

      const generatedId = `ai-${Date.now()}`;
      const newScenes = generatedData.scenes.map((scene, index) => {
        const isLast = index === generatedData.scenes.length - 1;
        return {
          ...scene,
          effect: isLast ? ('none' as const) : scene.effect,
        };
      });

      // Calculate actual frames (taking overlapping transitions into account)
      let actualFrames = 0;
      newScenes.forEach((scene, index) => {
        actualFrames += scene.durationInFrames;
        const isLast = index === newScenes.length - 1;
        if (!isLast && scene.effect !== 'none') {
          actualFrames -= 10;
        }
      });

      const totalSeconds = actualFrames / fps;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      if (projectId) {
        let existingProject: SidebarProject | null = null;
        try {
          existingProject = this.projectsService.findOne(projectId);
        } catch {
          // ignore
        }

        if (existingProject) {
          existingProject.title = `${title || 'AI Project'} (${tone})`;
          existingProject.duration = formattedDuration;
          existingProject.durationInFrames = actualFrames;
          existingProject.data = {
            themeColor: generatedData.themeColor || '#c89547',
            audioUrl: existingProject.data.audioUrl || '',
            scenes: newScenes,
          };
          return existingProject;
        }
      }

      const newProject: SidebarProject = {
        id: generatedId,
        title: `${title || 'AI Project'} (${tone})`,
        duration: formattedDuration,
        durationInFrames: actualFrames,
        thumbnail:
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=160&h=90&fit=crop&q=80',
        data: {
          themeColor: generatedData.themeColor || '#c89547',
          audioUrl: '',
          scenes: newScenes,
        },
      };

      this.projectsService.addProject(newProject);
      return newProject;
    } catch (error) {
      console.error('Failed to generate video with Gemini:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        `Không thể tạo video bằng AI: ${errorMessage}`,
      );
    }
  }
}
