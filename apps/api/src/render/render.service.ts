import { Injectable } from '@nestjs/common';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { enableTailwind } from '@remotion/tailwind-v4';
import { existsSync, mkdirSync } from 'fs';
import { basename, isAbsolute, join, resolve } from 'path';
import { randomUUID } from 'crypto';
import { RenderJob, RenderRequest } from './render.types';

@Injectable()
export class RenderService {
  private readonly jobs = new Map<string, RenderJob>();
  private serveUrlPromise: Promise<string> | null = null;
  private readonly workspaceRoot = this.resolveWorkspaceRoot();

  startRender(request: RenderRequest): RenderJob {
    const id = randomUUID();
    const job: RenderJob = {
      id,
      status: 'queued',
      progress: 0,
      message: 'Queued render job',
    };

    this.jobs.set(id, job);
    void this.render(job, request);
    return job;
  }

  getJob(id: string): RenderJob | null {
    return this.jobs.get(id) ?? null;
  }

  private async getServeUrl(job: RenderJob): Promise<string> {
    if (!this.serveUrlPromise) {
      const entryPoint = resolve(
        this.workspaceRoot,
        'apps',
        'web',
        'src',
        'index.ts',
      );
      const publicDir = resolve(this.workspaceRoot, 'apps', 'web', 'public');

      this.serveUrlPromise = bundle({
        entryPoint,
        publicDir: existsSync(publicDir) ? publicDir : null,
        rootDir: resolve(this.workspaceRoot, 'apps', 'web'),
        webpackOverride: (currentConfiguration) =>
          enableTailwind(currentConfiguration),
        onProgress: (progress) => {
          job.status = 'bundling';
          job.progress = Math.max(job.progress, progress * 0.15);
          job.message = `Bundling Remotion composition (${Math.round(progress * 100)}%)`;
        },
      });
    }

    return this.serveUrlPromise;
  }

  private async render(job: RenderJob, request: RenderRequest) {
    try {
      const outputDir = this.resolveOutputDirectory(request.outputDirectory);
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      const safeTitle = (request.title || request.projectId || 'video')
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 48);
      const filename = `${safeTitle || 'video'}-${Date.now()}.mp4`;
      const outputLocation = join(outputDir, filename);
      const resolution = this.resolveResolution(request.resolution);

      job.status = 'bundling';
      job.message = 'Preparing Remotion bundle';
      const serveUrl = await this.getServeUrl(job);

      job.status = 'rendering';
      job.progress = Math.max(job.progress, 0.15);
      job.message = 'Resolving composition metadata';
      const inputProps = request.data as unknown as Record<string, unknown>;

      const composition = await selectComposition({
        serveUrl,
        id: 'VintageCinematic',
        inputProps,
        logLevel: 'warn',
        chromiumOptions: {
          disableWebSecurity: true,
          ignoreCertificateErrors: true,
        },
      });

      await renderMedia({
        serveUrl,
        composition: {
          ...composition,
          width: resolution.width,
          height: resolution.height,
        },
        inputProps,
        codec: 'h264',
        outputLocation,
        overwrite: true,
        logLevel: 'warn',
        chromiumOptions: {
          disableWebSecurity: true,
          ignoreCertificateErrors: true,
        },
        onProgress: ({ progress, renderedFrames, encodedFrames }) => {
          job.status = 'rendering';
          job.progress = 0.15 + progress * 0.85;
          job.message = `Rendering frames ${renderedFrames}, encoding ${encodedFrames}`;
        },
      });

      job.status = 'done';
      job.progress = 1;
      job.message = 'Render complete';
      job.filename = filename;
      job.outputLocation = outputLocation;
      job.outputUrl = `/api/render/${job.id}/download`;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      job.status = 'error';
      job.error = message;
      job.message = 'Render failed';
    }
  }

  private resolveWorkspaceRoot(): string {
    const cwd = process.cwd();
    const directEntry = resolve(cwd, 'apps', 'web', 'src', 'index.ts');
    if (existsSync(directEntry)) {
      return cwd;
    }

    if (basename(cwd) === 'api') {
      const fromApiWorkspace = resolve(cwd, '..', '..');
      const entryPoint = resolve(fromApiWorkspace, 'apps', 'web', 'src', 'index.ts');
      if (existsSync(entryPoint)) {
        return fromApiWorkspace;
      }
    }

    const parent = resolve(cwd, '..');
    const parentEntry = resolve(parent, 'apps', 'web', 'src', 'index.ts');
    if (existsSync(parentEntry)) {
      return parent;
    }

    return cwd;
  }

  private resolveOutputDirectory(outputDirectory: string | undefined): string {
    if (!outputDirectory?.trim()) {
      return resolve(this.workspaceRoot, 'renders');
    }

    return isAbsolute(outputDirectory)
      ? outputDirectory
      : resolve(this.workspaceRoot, outputDirectory);
  }

  private resolveResolution(resolution: RenderRequest['resolution']) {
    switch (resolution) {
      case '1080p':
        return { width: 1920, height: 1080 };
      case '1440p':
        return { width: 2560, height: 1440 };
      case '4k':
        return { width: 3840, height: 2160 };
      case '720p':
      default:
        return { width: 1280, height: 720 };
    }
  }
}
