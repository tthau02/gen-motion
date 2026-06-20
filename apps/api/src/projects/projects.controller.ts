import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { SidebarProject, VideoMetadata } from '../types';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(): SidebarProject[] {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): SidebarProject {
    return this.projectsService.findOne(id);
  }

  @Post(':id')
  update(
    @Param('id') id: string,
    @Body() metadata: VideoMetadata,
  ): SidebarProject {
    return this.projectsService.update(id, metadata);
  }

  @Post()
  create(@Body() project: SidebarProject): SidebarProject {
    this.projectsService.addProject(project);
    return project;
  }
}
