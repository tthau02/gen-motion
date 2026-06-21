# Base image with Node.js
FROM node:20-bullseye-slim

# Install Chromium, FFMPEG, and basic multilingual fonts for video rendering
RUN apt-get update && apt-get install -y \
    chromium \
    ffmpeg \
    fonts-noto-color-emoji \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-kacst \
    fonts-freefont-ttf \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Inform Puppeteer/Remotion to skip downloading its own Chromium and use the system one
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV REMOTION_CHROMIUM_PATH=/usr/bin/chromium

# Set working directory
WORKDIR /app

# Copy dependency configs for workspaces
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/api/package*.json ./apps/api/

# Install dependencies (monorepo workspaces)
RUN npm install

# Copy source files
COPY . .

# Build NestJS API
RUN npm run build:api

# Expose port (Render/Railway will read this or PORT env variable)
EXPOSE 3000

# Start NestJS backend api server
CMD ["node", "apps/api/dist/main"]
