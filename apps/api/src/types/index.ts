export class VideoScene {
  type:
    | 'intro'
    | 'react'
    | 'precision'
    | 'audio'
    | 'scale'
    | 'transitions'
    | 'performance'
    | 'outro';
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
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
  };
}

export class VideoMetadata {
  themeColor: string;
  audioUrl?: string;
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
