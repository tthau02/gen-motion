import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { SidebarProject } from '../types';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

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
    },
  ): Promise<SidebarProject> {
    const { title, description, duration, tone, projectId, templates } = body;
    return await this.aiService.generateVideo(
      title,
      description,
      duration,
      tone,
      projectId,
      templates,
    );
  }
}
