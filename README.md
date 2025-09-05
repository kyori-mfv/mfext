# MFExt - React Server Components Framework

A full-stack React framework with built-in React Server Components (RSC) and Server-Side Rendering (SSR) support, similar to Next.js but with a focus on modern architecture and development experience.

## 🚀 Features

- **React Server Components (RSC)** - Server-side rendering with streaming and partial hydration
- **Server-Side Rendering (SSR)** - Traditional SSR support for optimal SEO and performance
- **Development Server** - Hot reloading development environment
- **TypeScript First** - Full TypeScript support with strict type checking
- **Modern Build System** - Webpack-based build system with optimized bundling
- **Monorepo Architecture** - Clean separation of concerns with workspace packages

## 📁 Project Structure

This is a monorepo with the following structure:

```
├── packages/
│   ├── core/          # Framework implementation and CLI
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
cd mf-react-rsc
```

2. Install dependencies:

```bash
pnpm install
```

3. Build all packages:

```bash
pnpm build
```

4. Start the playground application:

```bash
cd apps/playground
pnpm start
```

## 📦 Packages

### [@mfext/core](./packages/core/)

The main framework package containing the CLI tool, build system, and server implementations for both RSC and SSR.

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
