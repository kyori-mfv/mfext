# @mfext/core

The core framework package that provides the CLI, build system, and server implementations for React Server Components (RSC) and Server-Side Rendering (SSR).

## 🚀 Features

- **CLI Tool** - Command-line interface for building and starting applications
- **Build System** - Webpack-based build pipeline with multiple targets
- **RSC Server** - React Server Components server implementation
- **SSR Server** - Server-Side Rendering server implementation
- **Development Mode** - Hot reloading and development server
- **TypeScript Support** - Full TypeScript integration

## 📦 Installation

```bash
pnpm add @mfext/core
```

## 🛠 CLI Usage

The package provides a `mfext` CLI tool:

### Build Commands

```bash
# Full build pipeline (discover → client → ssr → rsc)
mfext build

# Individual build targets
mfext build discover     # Discover pages and generate routes manifest
mfext build client       # Build client-side bundle
mfext build ssr          # Build server-side rendering bundle
mfext build rsc          # Build React Server Components bundle
```

### Development Commands

```bash
# Start development servers
mfext start              # Start both RSC and SSR servers (default)
mfext start both         # Start both RSC and SSR servers
mfext start ssr          # Start SSR server only
mfext start rsc          # Start RSC server only
```

### Build Options

```bash
mfext build [type] --mode <development|production> --watch
```

## 🏗 Architecture

### Build Pipeline

The framework uses a multi-stage build process:

1. **Discover** - Scans the `src/pages` directory and generates a routes manifest
2. **Client** - Builds the client-side React bundle with hydration
3. **SSR** - Builds the server-side rendering bundle
4. **RSC** - Builds the React Server Components bundle

### Server Implementation

- **RSC Server** - Handles React Server Components requests with streaming
- **SSR Server** - Traditional server-side rendering with full page responses
- **Development Server** - Concurrent development servers with hot reloading

### Project Structure

```
src/
├── app/           # Application setup and configuration
├── build/         # Build system and webpack configurations
├── client/        # Client-side runtime and hydration
├── router/        # File-based routing system
├── server/        # Server implementations (RSC & SSR)
└── types/         # TypeScript type definitions
```

## 📁 Key Components

### CLI (`bin/cli.js`)

Entry point for the command-line interface with routing to build and start commands.

### Build System (`src/build/`)

- Webpack configurations for different targets
- Page discovery and route generation
- Asset optimization and bundling

### Server (`src/server/`)

- Express-based server implementations
- RSC request handling with React streaming
- SSR rendering with full HTML responses
- Static file serving

### Router (`src/router/`)

- File-based routing system
- Route manifest generation
- Dynamic route matching

## 🔧 Configuration

The framework expects applications to follow this structure:

```
your-app/
├── src/
│   ├── app/         # Page components (file-based routing)
│   └── components/    # Reusable components
├── public/            # Static assets
└── package.json       # Must include @mfext/core dependency
```

## 🎯 Usage in Applications

### Page Components

Create pages in the `src/pages` directory:

```tsx
// src/app/index.tsx
export default function HomePage() {
    return <h1>Welcome to MFExt!</h1>;
}

// src/app/about.tsx
export default function AboutPage() {
    return <h1>About Us</h1>;
}
```

### Package.json Scripts

Add these scripts to your application's `package.json`:

```json
{
    "scripts": {
        "build": "mfext build",
        "start": "mfext start",
        "dev": "mfext start --mode development"
    },
    "dependencies": {
        "@mfext/core": "workspace:*"
    }
}
```

## 🔍 Development

### Building from Source

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

### Testing

The core package can be tested using the playground application:

```bash
cd apps/playground
pnpm build
pnpm start
```

## 📋 Dependencies

### Runtime Dependencies

- `express` - Web server framework
- `react` & `react-dom` - React library and DOM renderer
- `react-server-dom-webpack` - React Server Components support
- `fs-extra` - Enhanced file system utilities
- `glob` - File pattern matching
- `concurrently` - Run multiple commands concurrently

### Build Dependencies

- `webpack` - Module bundler
- `babel` - JavaScript transpiler
- `typescript` - TypeScript compiler
- Various webpack loaders and plugins

## 🚦 Requirements

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- React 19.x (for RSC support)

## 🤝 Contributing

1. Follow the monorepo contribution guidelines
2. Ensure all TypeScript types are properly defined
3. Test changes using the playground application
4. Run `pnpm validate` before submitting PRs

## 📖 Related

- [Main README](../../README.md) - Monorepo overview
- [Playground](../../apps/playground/) - Example usage
- [Config](../config/) - Shared configurations
