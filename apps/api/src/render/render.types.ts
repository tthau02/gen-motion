import { VideoMetadata } from '../types';

export class RenderRequest {
  projectId: string;
  title: string;
  data: VideoMetadata;
  outputDirectory?: string;
  resolution?: '720p' | '1080p' | '1440p' | '4k';
}

export class RenderJob {
  id: string;
  status: 'queued' | 'bundling' | 'rendering' | 'done' | 'error';
  progress: number;
  message: string;
  outputUrl?: string;
  filename?: string;
  outputLocation?: string;
  error?: string;
}
