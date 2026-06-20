import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { RenderService } from './render.service';
import { RenderJob, RenderRequest } from './render.types';

@Controller('render')
export class RenderController {
  constructor(private readonly renderService: RenderService) {}

  @Post()
  start(@Body() request: RenderRequest): RenderJob {
    return this.renderService.startRender(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string): RenderJob {
    const job = this.renderService.getJob(id);
    if (!job) {
      throw new NotFoundException(`Render job "${id}" not found`);
    }
    return job;
  }

  @Get(':id/download')
  download(@Param('id') id: string, @Res() res: Response) {
    const job = this.renderService.getJob(id);
    if (!job || !job.outputLocation || !job.filename) {
      throw new NotFoundException(`Rendered file for job "${id}" not found`);
    }

    return res.download(job.outputLocation, job.filename);
  }
}
