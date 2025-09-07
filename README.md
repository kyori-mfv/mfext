# MFExt - React Server Components Framework

A full-stack React framework with built-in React Server Components (RSC) and Server-Side Rendering (SSR) support, similar to Next.js but with a focus on modern architecture and development experience.

## 🚀 Features

- **React Server Components (RSC)** - Server-side rendering with streaming and partial hydration
- **Server-Side Rendering (SSR)** - Traditional SSR support for optimal SEO and performance
- **Client-Side Navigation** - Next.js-compatible navigation with RSC support
- **Development Server** - Hot reloading development environment
- **TypeScript First** - Full TypeScript support with strict type checking
- **Modern Build System** - Webpack-based build system with optimized bundling
- **Monorepo Architecture** - Clean separation of concerns with workspace packages

## 📁 Project Structure

This is a monorepo with the following structure:

```
├── packages/
│   ├── core/          # Framework implementation and CLI
│   ├── navigation/    # Navigation components and utilities
│   └── config/        # Shared configurations (ESLint, Prettier, TypeScript)
├── apps/
│   └── playground/    # Example application using the framework
└── package.json       # Root package.json with workspace configuration
```

## 🛠 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mfext
```

2. Install dependencies:

```bash
pnpm install
```

3. Build all packages:

```bash
pnpm playground:build
```

4. Start the playground application:

```bash
pnpm playground:start
```

## 📦 Packages

### [@mfext/core](./packages/core/)

The main framework package containing the CLI tool, build system, and server implementations for both RSC and SSR.

### [@mfext/navigation](./packages/navigation/)

Navigation components and utilities providing Next.js-compatible client-side navigation with RSC support. Includes `Link` component, `useRouter` hook, and navigation context.

### [@mfext/config](./packages/config/)

Shared configuration files for ESLint, Prettier, and TypeScript used across the monorepo.

### [@mfext/playground](./apps/playground/)

Example application demonstrating framework usage with sample pages and components.

## 🎯 Usage

The framework provides a CLI tool (`mfext`) for building and running applications:

### Build Commands

```bash
mfext build              # Full build pipeline
mfext build discover     # Discover pages and generate routes
mfext build client       # Build client-side bundle
mfext build ssr          # Build server-side rendering
mfext build rsc          # Build React Server Components
```

### Development Commands

```bash
mfext start              # Start both RSC and SSR servers
mfext start ssr          # Start SSR server only
mfext start rsc          # Start RSC server only
```

## 🧪 Development

### Available Scripts

From the root directory:

```bash
pnpm build        # Build all packages
pnpm start        # Start all applications
pnpm lint         # Lint all packages
pnpm typecheck    # Type check all packages
pnpm validate     # Run lint, format check, and typecheck
```

### Code Quality

The project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking
- **Husky** for git hooks

## 🏗 Architecture

The framework is built with a modular architecture:

1. **Core Package** - Contains the main framework logic, CLI, and build system
2. **Config Package** - Shared tooling configurations
3. **Playground App** - Example implementation and testing ground

### Key Features

- **File-based Routing** - Automatic route generation from page files
- **Build Pipeline** - Multi-stage build process with discovery, client, SSR, and RSC compilation
- **Development Server** - Concurrent development servers for rapid iteration
- **TypeScript Integration** - Full TypeScript support throughout the stack

## 🎯 Phase 1 Implementation Status - ✅ COMPLETED

Phase 1 focused on implementing core navigation features with React Server Components support:

### ✅ Completed Tasks

1. **App Router Implementation** - Built file-based routing system with Next.js App Router compatibility
2. **RSC Integration** - Full React Server Components support with streaming and client hydration
3. **Unified Server Architecture** - Single server handling both SSR and RSC requests
4. **Navigation System** - Complete client-side navigation with RSC support:
    - `@mfext/navigation` package with simplified, production-ready components
    - `Link` component with essential navigation features
    - `useRouter` hook providing pathname, push, replace, and back functionality
    - Centralized RSC Manager for navigation state and data fetching
    - Automatic NavigationProvider injection at framework level

### Key Implementation Details

- **RSC Manager**: Centralized navigation handling with `createFromReadableStream` for React Flight data
- **Event-Driven Architecture**: Custom events (`mfext-navigation`) for navigation coordination
- **SSR/Client Consistency**: NavigationProvider wrapping ensures hydration compatibility
- **Simplified API**: Removed complex features like prefetch, query params, and scroll behavior for production stability

All Phase 1 navigation tasks have been successfully implemented and simplified per requirements.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

[Add your license information here]

## 🔗 Related

- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
