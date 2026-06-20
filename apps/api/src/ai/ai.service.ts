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
    templates?: string[],
  ): Promise<SidebarProject> {
    const durationNum = parseInt(duration) || 10; // default 10 seconds
    const fps = 30;
    const totalFramesNeeded = durationNum * fps;

    // Dynamically adjust number of scenes and duration limits depending on requested total length
    let minScenes = 3;
    let maxScenes = 6;
    let minFrameDuration = 90; // 3s
    let maxFrameDuration = 180; // 6s

    if (durationNum > 30) {
      // Scale scenes but cap them at a reasonable amount to avoid response token limits (max 25 scenes)
      minScenes = Math.min(20, Math.max(5, Math.floor(durationNum / 10)));
      maxScenes = Math.min(25, Math.max(8, Math.ceil(durationNum / 6)));

      // Scale frame duration so a few scenes can span the long video
      minFrameDuration = Math.max(
        120,
        Math.floor((totalFramesNeeded / maxScenes) * 0.8),
      );
      maxFrameDuration = Math.max(
        240,
        Math.ceil((totalFramesNeeded / minScenes) * 1.2),
      );
    }

    let templateConstraint = '';
    if (templates && templates.length > 0) {
      templateConstraint = `\n- CRITICAL CONSTRAINT: You MUST only use the following template types for the scenes: [${templates.map((t) => `'${t}'`).join(', ')}]. You are not allowed to choose or invent any other template types. The type of each scene must be one of these specified values. Please distribute the scenes among these chosen templates in a logical narrative sequence.`;
    }

    const prompt = `
You are a creative video director. Generate a structured multi-scene video configuration based on the following user input:
- Title/Topic: ${title}
- Prompt/Description: ${description}
- Desired Duration: ${durationNum} seconds
- Theme Tone: ${tone}${templateConstraint}

Total frames target: ${totalFramesNeeded} frames (at 30 frames per second).
You must divide the total duration of ${totalFramesNeeded} frames into a logical sequence of individual scenes.
You should generate between ${minScenes} to ${maxScenes} scenes depending on the topic.
The sum of the scene durations should equal roughly ${totalFramesNeeded} frames (each scene durationInFrames should typically be between ${minFrameDuration} and ${maxFrameDuration} frames).

Guidelines for generating each scene:
1. Each scene has a 'type' (the layout template). Intelligently analyze the user's prompt and theme to select the best type.
   You should choose one of the 12 built-in layout templates:
   - 'intro': Use for title cards, opening hooks.
   - 'react': Use to demonstrate coding, React component snippets, showing computer code.
   - 'precision': Use for lists, timelines, timers, precision parameters.
   - 'audio': Use for podcasts, wave visuals, music, audio wave elements.
   - 'scale': Use for scaling up, networks, globe view, astronomical scales.
   - 'transitions': Use for atmospheric pan shots, filters, landscape.
   - 'performance': Use for performance metrics, server speed graphs, numbers.
   - 'outro': Use for call to action cards, closing, npm terminal command displays.
   - 'cyberpunk': Use for high-tech, hacker, cyber-security, coding, neon-lit designs.
   - 'corporate': Use for business cards, finance charts, growth metrics, corporate meetings.
   - 'vintage': Use for historical topics, cooking history, old narratives, nostalgic stories.
   - 'playful': Use for games, pop art designs, playful kid challenges, vibrant colors.
   BUT, you are not strictly limited to this list: if you want to invent a completely new scene type to customize according to the requirements of the video description (e.g. 'culinary', 'nature', 'gaming', 'education', 'space_travel', etc.), you can do so! The frontend will dynamically adapt and render a stunning dynamic theme based on your custom name!

2. Provide a short, uppercase, punchy title ('title') and a supportive 'subtitle' in Vietnamese.
3. Write a brief, high-quality, engaging scene description ('description') in Vietnamese (1-2 sentences).
4. For the image URL ('imageUrl'), choose/construct a highly relevant landscape image from Unsplash. You can use standard Unsplash CDN URLs like:
   - Programming/Coding: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1280&h=720&q=80'
   - UI Design: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1280&h=720&q=80'
   - Servers/Infrastructure: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1280&h=720&q=80'
   - Hourglass/Timer: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1280&h=720&q=80'
   - Galaxy/Space: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1280&h=720&q=80'
   - Earth Orbit/Space: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1280&h=720&q=80'
   - Sound Wave/Concert: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1280&h=720&q=80'
   - Cinema/Projector: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1280&h=720&q=80'
   - Cassette Tape: 'https://images.unsplash.com/photo-1484755560693-a4074577af3a?auto=format&fit=crop&w=1280&h=720&q=80'
   - Modern Skyscraper: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1280&h=720&q=80'
   - Business Meeting: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1280&h=720&q=80'
   - Ramen Noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1280&h=720&q=80'
   - Gourmet Steak/Platter: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1280&h=720&q=80'
   - Vintage Vinyl Player: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=1280&h=720&q=80'
   - Autumn Forest: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1280&h=720&q=80'
   - Sunlit Nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1280&h=720&q=80'
   - Gaming Controller/RGB: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1280&h=720&q=80'
   Or construct any valid landscape Unsplash photo URL that fits the topic perfectly using the pattern:
   'https://images.unsplash.com/photo-<photoId>?auto=format&fit=crop&w=1280&h=720&q=80'
   where <photoId> is a real Unsplash photo identifier you know that matches the scene content.

5. Set an transition 'effect' for each scene (except the last scene which must have 'none'): 'fade', 'slide-left', 'slide-right' or 'none'.
6. If the scene type is 'react' (or a dynamic code template), fill 'customProps.codeSnippet' with an illustrative code snippet relevant to the topic.
7. If the scene type is 'outro', fill 'customProps.terminalCommand' with a relevant terminal command like 'npm run build' or 'npx run-composer@latest'.
8. For every scene, use 'customProps' to direct the rendered UI:
   - layoutVariant: choose 'center', 'split', 'spotlight', or 'dashboard'.
   - visualStyle: choose 'cinematic', 'minimal', 'technical', or 'bold'.
   - badgeText: short uppercase label for the scene category.
   - metricLabel and metricValue: a short insight/stat when useful, for example "STABILITY" and "99.9%".
   - chips: 2 to 4 short keywords that should appear as UI chips. Keep each chip under 18 characters.
   These UI directions must be content-specific, not generic.

Assign a custom hex color code to 'themeColor' matching the visual theme and mood of the video (e.g. Deep Forest Green '#054e3b' for nature/food, Neon Cyberpunk Pink '#ec4899' or Cyan '#06b6d4' for tech/futurism, Warm Amber/Gold '#c89547' for vintage/historical, Playful Sunny Yellow '#eab308' or Magenta '#d946ef' for entertainment/creative). Choose any color that fits. Do not limit yourself to standard preset colors.
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
                      ...(templates && templates.length > 0
                        ? { enum: templates }
                        : {}),
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
