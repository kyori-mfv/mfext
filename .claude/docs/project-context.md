# MFExt Project Context

## Project Overview

**MFExt** is a full-stack React framework with built-in React Server Components (RSC) and Server-Side Rendering (SSR) support, similar to Next.js but with a focus on modern architecture and development experience.

## Architecture

### Monorepo Structure
- `packages/core/` - Framework implementation and CLI tool
- `packages/config/` - Shared configurations (ESLint, Prettier, TypeScript)
- `apps/playground/` - Example application using the framework

### Server Architecture
- **Unified Server**: Single Express.js server handling both RSC and SSR requests
  - RSC endpoint: `/rsc` - Serves React Server Components
  - SSR endpoint: `*` (catch-all) - Serves server-side rendered pages
  - Located at: `packages/core/src/server/index.js`
- **Handler Architecture**: RSC and SSR handlers are built separately and loaded dynamically
  - RSC handler compiled to `dist/rsc/rsc-server.cjs`
  - SSR handler compiled to `dist/ssr/ssr-server.cjs`
