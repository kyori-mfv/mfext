# MFExt CLI Tool

The `mfext` command-line interface provides a comprehensive set of tools for building and running React Server Components applications with the MFExt framework.

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Commands Overview](#commands-overview)
- [Build Command](#build-command)
- [Start Command](#start-command)
- [Examples](#examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## 🚀 Installation

The CLI is automatically available when you install the `@mfext/core` package:

```bash
pnpm add @mfext/core
```

Or use it directly in your package.json scripts:

```json
{
    "scripts": {
        "build": "mfext build",
        "start": "mfext start",
        "dev": "mfext start --mode development"
    }
}
```

## ⚡ Quick Start

```bash
# Build your application
mfext build

# Start the servers
mfext start

# Get help
mfext --help
mfext build --help
```

## 📋 Commands Overview

| Command  | Description                          | Example        |
| -------- | ------------------------------------ | -------------- |
| `build`  | Build application bundles            | `mfext build`  |
| `start`  | Start development/production servers | `mfext start`  |
| `--help` | Show help information                | `mfext --help` |

---

## 🔨 Build Command

The build command compiles your application into optimized bundles for production or development.

### Usage

```bash
mfext build [<type>] [options]
```

### Build Types

| Type       | Description                         | Output                                |
| ---------- | ----------------------------------- | ------------------------------------- |
| `all`      | **Default** - Full pipeline         | `discover` → `client` → `ssr` → `rsc` |
| `discover` | Page discovery and route generation | Routes manifest in `dist/routes.json` |
| `client`   | Client-side React bundle            | Client bundle in `dist/client/`       |
| `ssr`      | Server-Side Rendering bundle        | SSR server in `dist/ssr/`             |
| `rsc`      | React Server Components bundle      | RSC server in `dist/rsc/`             |

### Build Pipeline (Full)

When running `mfext build` or `mfext build all`, the following pipeline executes:

1. **📋 Discover Pages** - Scans `src/pages/` directory
    - Generates route mappings
    - Creates navigation manifest
    - Outputs to `dist/routes.json`

2. **⚛️ Build Client** - Client-side React bundle
    - Hydration code
    - Client-side routing
    - Optimized for browser execution

3. **🖥️ Build SSR** - Server-Side Rendering
    - Server-side React rendering
    - HTML generation
    - SEO optimization

4. **🌐 Build RSC** - React Server Components
    - Server components compilation
    - Streaming support
    - Server-side data fetching

### Examples

```bash
# Full build pipeline (recommended)
mfext build
mfext build all

# Individual builds
mfext build discover     # Generate routes only
mfext build client       # Client bundle only
mfext build ssr         # SSR bundle only
mfext build rsc         # RSC bundle only

# With webpack options
mfext build --mode production
mfext build client --watch
mfext build --mode development --watch
```

### Build Options

All webpack options are passed through to the underlying webpack build:

| Option           | Description                               | Example             |
| ---------------- | ----------------------------------------- | ------------------- |
| `--mode <mode>`  | Build mode: `development` or `production` | `--mode production` |
| `--watch` / `-w` | Watch for changes                         | `--watch`           |
| `--env <env>`    | Environment variables                     | `--env production`  |

---

## 🚀 Start Command

The start command runs the compiled application servers for development or production.

### Usage

```bash
mfext start [<type>] [options]
```

### Server Types

| Type   | Description                            | Ports                | Use Case                |
| ------ | -------------------------------------- | -------------------- | ----------------------- |
| `both` | **Default** - Both RSC and SSR servers | RSC: 5001, SSR: 5000 | Full development        |
| `rsc`  | React Server Components only           | 5001                 | RSC development/testing |
| `ssr`  | Server-Side Rendering only             | 5000                 | SSR development/testing |

### Prerequisites

⚠️ **Important**: You must run `mfext build` before `mfext start`.

The start command requires compiled build files:

- `dist/rsc/rsc-server.cjs` (for RSC)
- `dist/ssr/ssr-server.js` (for SSR)
- `dist/routes.json` (routes manifest)

### Examples

```bash
# Start both servers (default)
mfext start
mfext start both

# Start specific server
mfext start rsc          # RSC server only (port 5001)
mfext start ssr          # SSR server only (port 5000)
```

### Server Details

#### RSC Server (Port 5001)

- **React Server Components** rendering
- **Streaming responses** for optimal performance
- **Server-side data fetching** capabilities
- **Component-level caching** support

#### SSR Server (Port 5000)

- **Traditional server-side rendering**
- **Full HTML responses** for SEO
- **Static file serving** from `public/` directory
- **Client-side hydration** support

### Graceful Shutdown

Both servers support graceful shutdown:

```bash
# Press Ctrl+C to stop servers gracefully
^C
🔄 Shutting down gracefully...
```

---

## 💡 Examples

### Complete Development Workflow

```bash
# 1. Build the application
mfext build

# 2. Start development servers
mfext start

# 3. Make changes to your code
# 4. Rebuild (in another terminal)
mfext build client --watch  # Watch for client changes
```

### Production Deployment

```bash
# 1. Build for production
mfext build --mode production

# 2. Start production servers
mfext start

# Application is ready for production traffic
```

### Debugging Specific Components

```bash
# Build and test RSC only
mfext build rsc
mfext start rsc

# Build and test SSR only
mfext build ssr
mfext start ssr
```

### Watch Mode Development

```bash
# Terminal 1: Watch and rebuild on changes
mfext build client --watch

# Terminal 2: Keep servers running
mfext start

# Your changes will be reflected after webpack rebuilds
```

---

## ⚙️ Configuration

### Project Structure Requirements

The CLI expects your project to follow this structure:

```
your-project/
├── src/
│   ├── pages/           # Required: Page components
│   │   ├── index.tsx    # Home page (/)
│   │   ├── about.tsx    # About page (/about)
│   │   └── ...
│   └── components/      # Optional: Shared components
├── public/              # Optional: Static assets
├── dist/                # Generated: Build output
└── package.json         # Required: Dependencies
```

### Environment Variables

The CLI respects these environment variables:

| Variable    | Description                        | Default         |
| ----------- | ---------------------------------- | --------------- |
| `NODE_ENV`  | Node environment                   | `development`   |
| `MFEXT_CWD` | Override current working directory | `process.cwd()` |

### Page Discovery Rules

The discover command finds pages using these patterns:

- **Pattern**: `src/pages/**/*.{tsx,jsx}`
- **Route Mapping**:
    - `src/pages/index.tsx` → `/` (Home page)
    - `src/pages/about.tsx` → `/about`
    - `src/pages/blog/post.tsx` → `/blog/post`
    - `src/pages/users/[id].tsx` → `/users/[id]` (future: dynamic routes)

---

## 🔧 Troubleshooting

### Common Issues

#### ❌ Build files not found

```
❌ Build files not found. Please run build first:
💡 Run 'mfext build' to create necessary build files
```

**Solution**: Always run `mfext build` before `mfext start`.

#### ❌ Unknown build type

```
❌ Unknown build type: xyz
Available types: discover, rsc, client, ssr, all
```

**Solution**: Use one of the supported build types: `discover`, `client`, `ssr`, `rsc`, or `all`.

#### ❌ Port already in use

```
❌ Failed to start RSC server: Error: listen EADDRINUSE :::5001
```

**Solution**:

- Check if another process is using ports 5000 or 5001
- Stop other servers: `pkill -f "node.*server"`
- Or change ports in your configuration

#### ❌ Pages directory not found

```
⚠️ Error discovering pages: ENOENT: no such file or directory, scandir 'src/pages'
```

**Solution**: Create the required `src/pages` directory and add at least one page component.

### Debug Mode

For verbose output, run with debugging:

```bash
DEBUG=mfext:* mfext build
DEBUG=mfext:* mfext start
```

### Getting Help

```bash
# General help
mfext --help
mfext -h

# Command-specific help
mfext build --help
mfext start --help
```

---

## 🏗️ Architecture

### CLI Structure

```
packages/core/bin/
├── cli.js              # Main CLI entry point
└── commands/
    ├── build.js        # Build command implementation
    ├── start.js        # Start command implementation
    └── discover.js     # Page discovery logic
```

### Build System

The CLI orchestrates webpack builds through:

1. **Configuration Loading** - Detects project structure
2. **Webpack Integration** - Spawns webpack processes
3. **Error Handling** - Provides meaningful error messages
4. **Progress Reporting** - Shows build progress and results

### Server Management

The start command:

1. **Validates Build Files** - Ensures required files exist
2. **Spawns Server Processes** - Launches RSC/SSR servers
3. **Process Management** - Handles graceful shutdown
4. **Error Recovery** - Provides debugging information

---

## 📖 Related Documentation

- [Core Package README](../README.md) - Framework overview
- [Main Repository README](../../../README.md) - Project structure
- [Playground Example](../../../apps/playground/README.md) - Usage examples

---

## 🤝 Contributing

1. CLI changes should be tested with the playground application
2. Follow existing error message patterns with emojis
3. Update this documentation for new commands or options
4. Ensure backward compatibility for existing scripts
