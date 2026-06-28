import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';
import { ProjectsService } from '../projects/projects.service';
import { SidebarProject, VideoScene } from '../types';

interface UnsplashSearchResponse {
  results?: Array<{
    urls?: {
      raw?: string;
      regular?: string;
    };
  }>;
}

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;
  private readonly imageCache = new Map<string, string>();
  private readonly cache = new Map<
    string,
    { timestamp: number; data: { themeColor: string; narrationText?: string; scenes: VideoScene[] } }
  >();
  private readonly cacheTtl = 5 * 60 * 1000; // 5 minutes TTL

  constructor(private readonly projectsService: ProjectsService) {
    // Initialize Google Gen AI client with environment variable key
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  private async resolveSceneImages(
    scenes: VideoScene[],
    aspectRatio: '16:9' | '9:16' = '16:9',
  ): Promise<VideoScene[]> {
    const resolvedScenes: VideoScene[] = [];

    for (const scene of scenes) {
      const keyword = this.buildImageKeyword(scene);
      const imageUrl = await this.resolveUnsplashImage(keyword, aspectRatio);
      resolvedScenes.push({
        ...scene,
        imageSearchKeyword: keyword,
        imageUrl,
      });
    }

    return resolvedScenes;
  }

  private buildImageKeyword(scene: VideoScene): string {
    const providedKeyword = scene.imageSearchKeyword?.trim();
    if (providedKeyword) {
      return providedKeyword;
    }

    const focalPoint =
      typeof scene.customProps?.focalPoint === 'string'
        ? scene.customProps.focalPoint
        : '';
    const type = scene.type ? `${scene.type} scene` : '';
    const source = [focalPoint, scene.subtitle, scene.title, type]
      .filter(Boolean)
      .join(' ');

    return source.trim() || 'cinematic editorial background';
  }

  private async resolveUnsplashImage(
    keyword: string,
    aspectRatio: '16:9' | '9:16',
  ): Promise<string> {
    const normalizedKeyword = keyword.trim().toLowerCase() || 'cinematic';
    const cacheKey = `${normalizedKeyword}_${aspectRatio}`;
    const cached = this.imageCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const fallbackUrl = this.getFallbackImageUrl(
      normalizedKeyword,
      aspectRatio,
    );
    const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
    if (!accessKey) {
      this.imageCache.set(cacheKey, fallbackUrl);
      return fallbackUrl;
    }

    try {
      const orientation = aspectRatio === '9:16' ? 'portrait' : 'landscape';
      const url = new URL('https://api.unsplash.com/search/photos');
      url.searchParams.set('query', normalizedKeyword);
      url.searchParams.set('orientation', orientation);
      url.searchParams.set('per_page', '1');
      url.searchParams.set('content_filter', 'high');

      const response = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
      });

      if (!response.ok) {
        throw new Error(`Unsplash search failed with ${response.status}`);
      }

      const data = (await response.json()) as UnsplashSearchResponse;
      const rawUrl =
        data.results?.[0]?.urls?.raw || data.results?.[0]?.urls?.regular;
      const imageUrl = rawUrl
        ? this.toRenderableUnsplashUrl(rawUrl, aspectRatio)
        : fallbackUrl;

      this.imageCache.set(cacheKey, imageUrl);
      return imageUrl;
    } catch (error) {
      console.warn(
        `Falling back to curated image for "${normalizedKeyword}":`,
        error instanceof Error ? error.message : String(error),
      );
      this.imageCache.set(cacheKey, fallbackUrl);
      return fallbackUrl;
    }
  }

  private toRenderableUnsplashUrl(
    rawUrl: string,
    aspectRatio: '16:9' | '9:16',
  ): string {
    const baseUrl = rawUrl.split('?')[0];
    const width = aspectRatio === '9:16' ? 720 : 1280;
    const height = aspectRatio === '9:16' ? 1280 : 720;
    return `${baseUrl}?auto=format&fit=crop&w=${width}&h=${height}&q=85`;
  }

  private getFallbackImageUrl(
    keyword: string,
    aspectRatio: '16:9' | '9:16',
  ): string {
    const fallbackImages = [
      {
        match: ['code', 'coding', 'program', 'developer', 'software', 'react'],
        id: '1555066931-4365d14bab8c',
      },
      {
        match: ['ui', 'interface', 'app', 'dashboard', 'screen'],
        id: '1516035069371-29a1b244cc32',
      },
      {
        match: ['server', 'cloud', 'data', 'infrastructure', 'performance'],
        id: '1558494949-ef010cbdcc31',
      },
      {
        match: ['space', 'galaxy', 'earth', 'orbit', 'network', 'scale'],
        id: '1451187580459-43490279c0fa',
      },
      {
        match: ['audio', 'music', 'podcast', 'sound', 'concert'],
        id: '1598488035139-bdbb2231ce04',
      },
      {
        match: ['cinema', 'film', 'movie', 'projector', 'vintage'],
        id: '1489599849927-2ee91cede3ba',
      },
      {
        match: ['business', 'corporate', 'meeting', 'office', 'finance'],
        id: '1551836022-d5d88e9218df',
      },
      {
        match: [
          'social',
          'community',
          'street',
          'daily',
          'people',
          'family',
          'culture',
          'market',
          'neighborhood',
          'urban life',
        ],
        id: '1529156069898-49953e39b3ac',
      },
      {
        match: ['food', 'cooking', 'ramen', 'restaurant', 'culinary'],
        id: '1569718212165-3a8278d5f624',
      },
      {
        match: ['nature', 'forest', 'green', 'garden', 'outdoor'],
        id: '1441974231531-c6227db76b6e',
      },
      {
        match: ['game', 'gaming', 'controller', 'playful', 'arcade'],
        id: '1538481199705-c710c4e965fc',
      },
    ];

    const selected =
      fallbackImages.find(({ match }) =>
        match.some((token) => keyword.includes(token)),
      ) ?? fallbackImages[5];
    const width = aspectRatio === '9:16' ? 720 : 1280;
    const height = aspectRatio === '9:16' ? 1280 : 720;
    return `https://images.unsplash.com/photo-${selected.id}?auto=format&fit=crop&w=${width}&h=${height}&q=85`;
  }

  private createThumbnailUrl(scenes: VideoScene[]): string {
    const imageUrl = scenes.find((scene) => scene.imageUrl)?.imageUrl;
    if (!imageUrl) {
      return this.getFallbackImageUrl('cinema', '16:9').replace(
        'w=1280&h=720',
        'w=160&h=90',
      );
    }

    try {
      const url = new URL(imageUrl);
      url.searchParams.set('w', '160');
      url.searchParams.set('h', '90');
      url.searchParams.set('fit', 'crop');
      return url.toString();
    } catch {
      return imageUrl;
    }
  }

  private isTechnicalTopic(title: string, description: string): boolean {
    const text = `${title} ${description}`.toLowerCase();
    const technicalSignals = [
      'ai',
      'api',
      'app',
      'cloud',
      'code',
      'coding',
      'cyber',
      'data',
      'developer',
      'finance',
      'metrics',
      'performance',
      'programming',
      'react',
      'server',
      'software',
      'startup',
      'technology',
      'tech',
      'website',
    ];

    return technicalSignals.some((signal) => text.includes(signal));
  }

  private normalizeSceneTypesForTopic(
    scenes: VideoScene[],
    title: string,
    description: string,
    templates?: string[],
  ): VideoScene[] {
    if (templates && templates.length > 0) {
      return scenes;
    }

    if (this.isTechnicalTopic(title, description)) {
      return scenes;
    }

    const techOnlyTypes = new Set([
      'react',
      'cyberpunk',
      'performance',
      'scale',
      'precision',
      'corporate',
    ]);
    const socialTypes = [
      'documentary',
      'lifestyle',
      'community',
      'street_story',
      'portrait',
      'culture',
    ];

    return scenes.map((scene, index) => {
      if (!techOnlyTypes.has(scene.type)) {
        return scene;
      }

      const customProps = { ...scene.customProps };
      delete customProps.codeSnippet;
      delete customProps.terminalCommand;
      delete customProps.metricLabel;
      delete customProps.metricValue;
      delete customProps.chips;

      return {
        ...scene,
        type: socialTypes[index % socialTypes.length],
        customProps: {
          ...customProps,
          layoutVariant: customProps.layoutVariant || 'center',
          visualStyle: customProps.visualStyle || 'cinematic',
          shotType: customProps.shotType || 'documentary',
          captionStyle: customProps.captionStyle || 'lower-third',
          overlayDensity: customProps.overlayDensity || 'low',
        },
      };
    });
  }

  async generateVideo(
    title: string,
    description: string,
    duration: string,
    tone: string,
    projectId?: string,
    templates?: string[],
    aspectRatio?: '16:9' | '9:16',
  ): Promise<SidebarProject> {
    const durationNum = parseInt(duration) || 10; // default 10 seconds
    const fps = 30;
    const totalFramesNeeded = durationNum * fps;

    // Cache key based on input parameters
    const cacheKey = `${title.trim().toLowerCase()}_${description.trim().toLowerCase()}_${duration}_${tone}_${(templates || []).join(',')}_${aspectRatio || '16:9'}`;

    if (!projectId && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < this.cacheTtl) {
        const generatedId = `ai-${Date.now()}`;
        const newScenes = cached.data.scenes.map((scene, index) => {
          const isLast = index === cached.data.scenes.length - 1;
          return {
            ...scene,
            effect: isLast ? ('none' as const) : scene.effect,
          };
        });

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

        const cachedProject: SidebarProject = {
          id: generatedId,
          title: `${title || 'AI Project'} (${tone}) (Cached)`,
          duration: formattedDuration,
          durationInFrames: actualFrames,
          thumbnail: this.createThumbnailUrl(newScenes),
          data: {
            themeColor: cached.data.themeColor || '#c89547',
            audioUrl: '',
            narrationText: cached.data.narrationText || '',
            aspectRatio: aspectRatio || '16:9',
            scenes: newScenes,
          },
        };

        this.projectsService.addProject(cachedProject);
        return cachedProject;
      }
    }

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
1. First classify the topic domain, then choose scene types that fit that domain. The scene 'type' is a visual template signal, not a decoration.
   Prefer domain-specific custom scene types when the topic is not technical. The frontend can render custom names dynamically.

   Strong defaults by domain:
   - Social life, daily life, community, public issues, family, culture, education, food, travel, health, documentary topics:
     Use types such as 'documentary', 'lifestyle', 'community', 'street_story', 'portrait', 'culture', 'education', 'culinary', 'nature', 'vintage', 'transitions', 'intro', 'outro'.
     DO NOT use 'react', 'cyberpunk', 'performance', 'scale', 'precision', or 'corporate' unless the user explicitly asks for technology, coding, cybersecurity, metrics, infrastructure, finance, or business.
   - Technology, software, coding, AI systems, cybersecurity:
     Use 'react', 'cyberpunk', 'precision', 'performance', 'scale', 'intro', 'outro' when appropriate.
   - Business, finance, startup, sales, enterprise:
     Use 'corporate', 'performance', 'precision', 'intro', 'outro' when appropriate.
   - Music, podcast, sound, concert:
     Use 'audio', 'transitions', 'intro', 'outro' when appropriate.
   - Games, entertainment, kid content:
     Use 'playful', 'transitions', 'intro', 'outro' when appropriate.

   Built-in types available when appropriate:
   'intro', 'react', 'precision', 'audio', 'scale', 'transitions', 'performance', 'outro', 'cyberpunk', 'corporate', 'vintage', 'playful'.

2. Provide a short, punchy title ('title') and a supportive 'subtitle' in Vietnamese. Do not force all-caps unless the scene is a technical interface, poster, or chapter card.
3. Write a brief, high-quality, engaging scene description ('description') in Vietnamese (1-2 sentences).
4. Do NOT return image URLs and do NOT invent Unsplash photo IDs. Instead, return 'imageSearchKeyword': a concise English search phrase for a real photo background. Make it concrete and visually searchable, for example:
   - "software developer desk close up"
   - "ramen chef hands kitchen"
   - "business team meeting natural light"
   - "vintage cinema projector"
   - "forest trail morning light"
   The backend will call the official Unsplash API and attach a valid 'imageUrl'. Your job is only to choose the most cinematic, subject-specific search keyword.

5. Set an transition 'effect' for each scene (except the last scene which must have 'none'): 'fade', 'slide-left', 'slide-right' or 'none'.
6. Only fill 'customProps.codeSnippet' when the scene is explicitly about programming, software, or a code interface. Never include code snippets for social life, documentary, culture, food, education, health, family, or community topics.
7. Only fill 'customProps.terminalCommand' when the video is about developer tooling or technical setup. For non-technical outros, use normal Vietnamese call-to-action text in title/subtitle/description instead.
8. For every scene, use 'customProps' as art direction, not generic dashboard decoration:
   - layoutVariant: choose 'center', 'split', 'spotlight', or 'dashboard'. Use 'dashboard' only when the scene is truly about data, systems, metrics, finance, analytics, or UI.
   - visualStyle: choose 'cinematic', 'minimal', 'technical', or 'bold'. Prefer 'minimal' or 'cinematic' for human/editorial subjects.
   - shotType: choose 'wide', 'close-up', 'detail', 'editorial', 'documentary', or 'data-insert'.
   - focalPoint: describe what the camera/layout should prioritize, for example "hands plating ramen", "founder portrait", "product screen", "historic street".
   - captionStyle: choose 'none', 'lower-third', 'chapter', 'caption', or 'annotation'. Prefer lower-third/chapter over floating cards.
   - textureLevel: choose 'none', 'subtle', or 'medium'. Texture should support the topic, not hide weak design.
   - overlayDensity: choose 'none', 'low', or 'medium'. Prefer low density. Use medium only for technical/data scenes.
   - supportingDetails: 1 to 3 concrete, scene-specific visual notes. Avoid generic words such as "sleek", "dynamic", "futuristic", "immersive", "stunning", or "cutting-edge".
   - badgeText, metricLabel, metricValue, and chips are OPTIONAL. Only include them when they carry real editorial meaning. Do not invent fake statistics. Do not add chips to cinematic, documentary, food, history, nature, or narrative scenes.

Avoid generic AI-looking design patterns: do not rely on abstract gradient blobs, decorative glass cards, random neon glow, fake metrics, generic badges, or keyword chips unless the subject explicitly calls for them. Each scene should feel like a directed shot with a concrete subject, intentional crop, and restrained typography.

Assign a custom hex color code to 'themeColor' matching the visual theme and mood of the video (e.g. Deep Forest Green '#054e3b' for nature/food, Neon Cyberpunk Pink '#ec4899' or Cyan '#06b6d4' for tech/futurism, Warm Amber/Gold '#c89547' for vintage/historical, Playful Sunny Yellow '#eab308' or Magenta '#d946ef' for entertainment/creative). Choose any color that fits. Do not limit yourself to standard preset colors.

7. IMPORTANT — NARRATION TEXT (narrationText):
   After designing all scenes, write a single, cohesive Vietnamese voiceover narration script that ties the entire video together. This narration will be spoken by an AI voice as the video plays.
   Requirements for narrationText:
   - Write ENTIRELY in Vietnamese, natural spoken language suitable for reading aloud.
   - Length: approximately ${Math.max(30, Math.round(durationNum * 2))} Vietnamese words — enough to read comfortably in ${durationNum} seconds at natural Vietnamese speech pace (~2-2.5 words/second).
   - The narration should flow naturally from scene to scene, referencing and connecting the content of each scene.
   - Use short, punchy sentences good for spoken delivery. No complex clauses.
   - Match the "${tone}" tone throughout.
   - Do NOT include scene numbers, speaker labels, stage directions, or any formatting — just the pure spoken text.
   - No markdown, no special characters, no brackets, no quotes around the text.
   - The narration should feel like one continuous story, not a list of scene descriptions.
   - ONLY return the narration text itself. No preamble, no explanation.
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
              narrationText: { type: Type.STRING },
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
                    imageSearchKeyword: { type: Type.STRING },
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
                        shotType: {
                          type: Type.STRING,
                          enum: [
                            'wide',
                            'close-up',
                            'detail',
                            'editorial',
                            'documentary',
                            'data-insert',
                          ],
                        },
                        focalPoint: { type: Type.STRING },
                        captionStyle: {
                          type: Type.STRING,
                          enum: [
                            'none',
                            'lower-third',
                            'chapter',
                            'caption',
                            'annotation',
                          ],
                        },
                        textureLevel: {
                          type: Type.STRING,
                          enum: ['none', 'subtle', 'medium'],
                        },
                        overlayDensity: {
                          type: Type.STRING,
                          enum: ['none', 'low', 'medium'],
                        },
                        supportingDetails: {
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
                    'imageSearchKeyword',
                    'durationInFrames',
                    'effect',
                  ],
                },
              },
            },
            required: ['themeColor', 'narrationText', 'scenes'],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Received empty text from Gemini models');
      }

      const generatedData = JSON.parse(responseText) as {
        themeColor: string;
        narrationText: string;
        scenes: VideoScene[];
      };

      const generatedId = `ai-${Date.now()}`;
      const domainAdjustedScenes = this.normalizeSceneTypesForTopic(
        generatedData.scenes,
        title,
        description,
        templates,
      );
      const scenesWithImages = await this.resolveSceneImages(
        domainAdjustedScenes,
        aspectRatio || '16:9',
      );
      const newScenes = scenesWithImages.map((scene, index) => {
        const isLast = index === scenesWithImages.length - 1;
        return {
          ...scene,
          effect: isLast ? ('none' as const) : scene.effect,
        };
      });

      // Save resolved scenes to cache so repeated prompts reuse valid image URLs.
      if (!projectId) {
        if (this.cache.size > 100) {
          const now = Date.now();
          for (const [key, val] of this.cache.entries()) {
            if (now - val.timestamp > this.cacheTtl) {
              this.cache.delete(key);
            }
          }
        }
        this.cache.set(cacheKey, {
          timestamp: Date.now(),
          data: {
            themeColor: generatedData.themeColor,
            narrationText: generatedData.narrationText || '',
            scenes: newScenes,
          },
        });
      }

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
          existingProject.thumbnail = this.createThumbnailUrl(newScenes);
          existingProject.data = {
            themeColor: generatedData.themeColor || '#c89547',
            audioUrl: existingProject.data.audioUrl || '',
            narrationText: generatedData.narrationText || '',
            aspectRatio:
              aspectRatio || existingProject.data.aspectRatio || '16:9',
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
        thumbnail: this.createThumbnailUrl(newScenes),
        data: {
          themeColor: generatedData.themeColor || '#c89547',
          audioUrl: '',
          narrationText: generatedData.narrationText || '',
          aspectRatio: aspectRatio || '16:9',
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
