export class VideoScene {
  type: string;
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  imageSearchKeyword?: string;
  durationInFrames: number;
  effect: 'fade' | 'slide-left' | 'slide-right' | 'none';
  customProps?: {
    codeSnippet?: string;
    terminalCommand?: string;
    layoutVariant?: 'center' | 'split' | 'spotlight' | 'dashboard';
    visualStyle?: 'cinematic' | 'minimal' | 'technical' | 'bold';
    badgeText?: string;
    metricLabel?: string;
    metricValue?: string;
    chips?: string[];
    shotType?:
      | 'wide'
      | 'close-up'
      | 'detail'
      | 'editorial'
      | 'documentary'
      | 'data-insert';
    focalPoint?: string;
    captionStyle?:
      | 'none'
      | 'lower-third'
      | 'chapter'
      | 'caption'
      | 'annotation';
    textureLevel?: 'none' | 'subtle' | 'medium';
    overlayDensity?: 'none' | 'low' | 'medium';
    supportingDetails?: string[];
    [key: string]: any;
  };
}

export class VideoMetadata {
  themeColor: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  audioUrl?: string;
  /** Pre-generated Vietnamese voiceover narration text (from AI prompt) */
  narrationText?: string;
  aspectRatio?: '16:9' | '9:16';
  scenes: VideoScene[];
}

export class SidebarProject {
  id: string;
  title: string;
  duration: string;
  durationInFrames: number;
  thumbnail: string;
  data: VideoMetadata;
}
