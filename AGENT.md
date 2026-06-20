# Project Overview & AI Coding Agent Guidelines

Welcome, AI agent! This document serves as the entry point to understand the project architecture, tech stack, code styles, and operational commands.

---

## 1. Project Purpose

This project is a CapCut-like dynamic video creation platform. It allows users to:
*   Select from different video template styles.
*   Edit scene content (text, images, durations, effects) with live visual feedback.
*   Auto-save edits to the backend (debounced).
*   Use an AI Video generation modal to prompt and generate custom scenes and video parameters dynamically.
*   Render and preview video sequences powered by **Remotion**.

---

## 2. Technology Stack

*   **Monorepo Infrastructure**: npm workspaces.
*   **Frontend (web)**: React 19, Vite, `@remotion/player`, `@remotion/transitions`, TailwindCSS.
*   **Backend (api)**: NestJS, Express adapter, TypeScript reflection.
*   **Language**: TypeScript (strict compiler options, Bundler/NodeNext resolution).

---

## 3. Workspace Directory Structure

```
video-remo-monorepo/
├── package.json                   # Root package.json (workspace configurations)
├── package-lock.json              # Linked workspaces lock
├── AGENT.md                       # This developer & AI guide
├── README.md                      # General setup commands
├── .gitignore                     # Shared git ignores
├── apps/
│   ├── web/                       # Frontend application
│   │   ├── package.json           # React/Vite dependencies
│   │   ├── vite.config.ts         # Vite server proxy setting (/api -> http://localhost:3000)
│   │   ├── src/
│   │   │   ├── App.tsx            # Main editor dashboard container (API integrated)
│   │   │   ├── Composition.tsx    # Master Remotion composition
│   │   │   ├── components/        # Modular editor UI panels
│   │   │   └── scenes/            # Individual React video scenes
│   │   └── ...
│   └── api/                       # NestJS API application
│       ├── package.json           # NestJS framework dependencies
│       ├── tsconfig.json          # TS config with emitDecoratorMetadata enabled
│       ├── src/
│       │   ├── main.ts            # Entrypoint (Global Prefix: /api, CORS enabled)
│       │   ├── app.module.ts      # Modules binder
│       │   ├── types/             # Shared classes (class instead of interface for metadata)
│       │   ├── projects/          # Template projects and custom edits manager
│       │   └── ai/                # Dynamic project generator
```

---

## 4. Coding Style & Architectural Guidelines

When modifying or expanding the codebase, adhere to these rules:

### TypeScript & NestJS Metadata Compatibility
*   **IMPORTANT**: In NestJS (`apps/api`), when `"isolatedModules": true` and `"emitDecoratorMetadata": true` are enabled, types referenced in decorated controller parameters (e.g. `@Body() data: MyType`) **MUST be defined as `class`** rather than `interface`. Otherwise, the TypeScript compiler fails with `TS1272` because runtime references cannot be emitted for interfaces.
*   Ensure all models shared via APIs are classes inside [apps/api/src/types/index.ts](file:///e:/ProjectCode/video-remo/apps/api/src/types/index.ts).

### Remotion Best Practices
*   **Animate using frames**: Always animate visual properties using `useCurrentFrame()` and `interpolate()`.
*   **FORBIDDEN**: Standard CSS transitions or CSS keyframe animations must **never** be used within video scenes. They fail to output deterministically during CLI rendering.
*   **HTML media**: Always use Remotion's native `<Img>` from `remotion` instead of `<img>` to ensure resource loading waits are resolved during renders.

### Client-Server Synchronization
*   The frontend uses a debounced `useEffect` (500ms) to auto-save local property modifications in the editor back to the NestJS backend (`POST /api/projects/:id`).
*   AI generation requests are posted to `POST /api/ai/generate`, which generates the metadata on the server, registers it in the projects library, and returns the project structure to the client.

---

## 5. Development Commands

Run these commands from the root directory:

*   **Install all dependencies**:
    ```bash
    npm install
    ```
*   **Start development mode (Concurrent Web + API)**:
    ```bash
    npm run dev
    ```
    *   Web runs on: `http://localhost:5173`
    *   API runs on: `http://localhost:3000` (requests from Web to `/api/*` are proxied here)
*   **Lint and Type-check**:
    ```bash
    npm run lint
    ```
*   **Build the production distribution**:
    ```bash
    npm run build
    ```
