import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AiService } from './ai.service';
import { SidebarProject } from '../types';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('generate')
  async generate(
    @Body()
    body: {
      title: string;
      description: string;
      duration: string;
      tone: string;
      projectId?: string;
      templates?: string[];
      aspectRatio?: '16:9' | '9:16';
    },
  ): Promise<SidebarProject> {
    const {
      title,
      description,
      duration,
      tone,
      projectId,
      templates,
      aspectRatio,
    } = body;
    return await this.aiService.generateVideo(
      title,
      description,
      duration,
      tone,
      projectId,
      templates,
      aspectRatio,
    );
  }
}
