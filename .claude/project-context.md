# MFExt Project Context

This document provides essential context for Claude to understand the MFExt React Server Components framework project.

## Project Overview

**MFExt** is a full-stack React framework with built-in React Server Components (RSC) and Server-Side Rendering (SSR) support, similar to Next.js but with a focus on modern architecture and development experience.

## Architecture

### Monorepo Structure
```
mf-react-rsc/
├── packages/
│   ├── core/          # Framework implementation and CLI tool
│   └── config/        # Shared configurations (ESLint, Prettier, TypeScript)
├── apps/
│   └── playground/    # Example application using the framework
└── .claude/          # Claude context and commands
```

### Key Components

1. **Core Package (`@mfext/core`)**
   - CLI tool (`mfext` command)
   - Build system (Webpack-based)
   - RSC server implementation (port 5001)
   - SSR server implementation (port 5000)
   - File-based routing system

2. **Config Package (`@mfext/config`)**
   - ESLint configuration
   - Prettier configuration
   - TypeScript configuration
   - Shared across monorepo

3. **Playground App (`@mfext/playground`)**
   - Example implementation
   - Testing environment
   - Development reference

## Technology Stack

- **Runtime**: Node.js >= 20.0.0
- **Package Manager**: pnpm >= 9.0.0
- **Framework**: React 19.x (with RSC support)
- **Build Tool**: Webpack 5
- **Language**: TypeScript
- **Server**: Express.js
- **Linting**: ESLint 9.x
- **Formatting**: Prettier 3.x

## Development Workflow

### Build Pipeline
The framework uses a multi-stage build process:

1. **Discover** - Scans `src/pages/` and generates routes manifest
2. **Client** - Builds client-side React bundle with hydration
3. **SSR** - Builds server-side rendering bundle
4. **RSC** - Builds React Server Components bundle

### Server Architecture
- **RSC Server** (port 5001) - Handles React Server Components with streaming
- **SSR Server** (port 5000) - Traditional server-side rendering with full HTML responses

### File-based Routing
Pages are automatically discovered from `src/pages/`:
- `src/pages/index.tsx` → `/`
- `src/pages/about.tsx` → `/about`
- `src/pages/blog/post.tsx` → `/blog/post`

## Key Files and Locations

### Core Package
- `packages/core/bin/cli.js` - Main CLI entry point
- `packages/core/src/build/` - Build system and webpack configs
- `packages/core/src/server/` - RSC and SSR server implementations
- `packages/core/src/router/` - File-based routing logic

### Configuration
- `packages/config/eslint.config.js` - ESLint rules
- `packages/config/prettier.config.js` - Prettier settings
- `packages/config/tsconfig.json` - TypeScript config

### Playground
- `apps/playground/src/pages/` - Example pages
- `apps/playground/src/components/` - Example components

## Common Development Tasks

### Building
```bash
# Full build pipeline
pnpm build
mfext build

# Individual builds
mfext build discover    # Page discovery
mfext build client      # Client bundle
mfext build ssr        # SSR bundle
mfext build rsc        # RSC bundle
```

### Development Servers
```bash
# Start both servers
pnpm start
mfext start

# Individual servers
mfext start rsc        # RSC only (port 5001)
mfext start ssr        # SSR only (port 5000)
```

### Testing
Use the playground app to test framework changes:
```bash
cd apps/playground
pnpm build
pnpm start
```

## Code Quality

### Scripts Available
- `pnpm lint` - ESLint across all packages
- `pnpm typecheck` - TypeScript checking
- `pnpm validate` - Runs lint + format check + typecheck
- `pnpm format` - Prettier formatting

### Git Hooks
- Husky configured for pre-commit hooks
- Automatic linting and formatting on commit

## Important Patterns

### Package Dependencies
- Core package provides the CLI and framework
- Config package is shared across the monorepo
- Playground uses both core and config packages
- All packages use workspace references (`workspace:*`)

### Build Output
- `dist/` directory contains compiled assets
- `dist/routes.json` - Routes manifest
- `dist/client/` - Client-side bundle
- `dist/ssr/` - SSR server bundle
- `dist/rsc/` - RSC server bundle

### Development Considerations
- Always run `mfext build` before `mfext start`
- RSC requires React 19+ with server components support
- Ports 5000 (SSR) and 5001 (RSC) must be available
- Changes require rebuilding relevant bundles

## Current Status

The framework is in active development with:
- ✅ Basic RSC and SSR functionality
- ✅ File-based routing
- ✅ CLI tool with build and start commands
- ✅ Monorepo structure with shared configurations
- ✅ Example playground application
- 🚧 Documentation recently completed
- 🚧 Advanced features like dynamic routing may be in progress

## Common Issues

1. **Build files not found** - Run `mfext build` first
2. **Port conflicts** - Kill existing processes on ports 5000/5001
3. **TypeScript errors** - Run `pnpm typecheck` to see all issues
4. **Linting issues** - Run `pnpm lint:fix` to auto-fix

## Next Steps / Future Development

Likely areas for enhancement:
- Dynamic routing support
- API routes
- Middleware system
- Performance optimizations
- Additional CLI commands
- Plugin system