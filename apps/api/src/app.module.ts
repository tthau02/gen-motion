import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { AiModule } from './ai/ai.module';
import { RenderModule } from './render/render.module';

@Module({
  imports: [ProjectsModule, AiModule, RenderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
