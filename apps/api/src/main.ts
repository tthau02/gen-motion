import * as dotenv from 'dotenv';
import { basename, join, resolve } from 'path';
import express from 'express';
import { existsSync } from 'fs';

const loadEnv = () => {
  const envPaths = [
    join(process.cwd(), '.env'),
    join(process.cwd(), 'apps', 'api', '.env'),
    resolve(__dirname, '..', '.env'),
  ];

  for (const envPath of envPaths) {
    if (existsSync(envPath)) {
      dotenv.config({ path: envPath, override: false });
    }
  }
};

loadEnv();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function resolveWorkspaceRoot() {
  const cwd = process.cwd();
  if (existsSync(resolve(cwd, 'apps', 'web', 'src', 'index.ts'))) {
    return cwd;
  }

  if (basename(cwd) === 'api') {
    return resolve(cwd, '..', '..');
  }

  return cwd;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use('/renders', express.static(join(resolveWorkspaceRoot(), 'renders')));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
