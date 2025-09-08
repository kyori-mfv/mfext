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

## 🚀 Using Published Packages

```bash
# Configure your project to use GitHub Packages
cat > .npmrc << EOF
@kyori-mfv:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}
EOF

# Set your GitHub token (with read:packages permission)
export GITHUB_TOKEN=your_github_token_here

# Install packages in your project
npm install @kyori-mfv/mfext-core @kyori-mfv/mfext-navigation react react-dom

# Create basic app structure
mkdir -p src/app
echo 'export default function Page() { return <h1>Hello MFExt!</h1>; }' > src/app/page.tsx
echo 'export default function Layout({ children }: { children: React.ReactNode }) { return <html><body>{children}</body></html>; }' > src/app/layout.tsx

# Build and start
npx mfext build
npx mfext start
```

## 📦 Packages

### [@kyori-mfv/mfext-core](./packages/core/)

**CLI Tool Package** - Contains the `mfext` command-line tool for building and running applications. This is not a library package - users interact with it via the CLI commands (`mfext build`, `mfext start`).

### [@kyori-mfv/mfext-navigation](./packages/navigation/)

Navigation components and utilities providing Next.js-compatible client-side navigation with RSC support. Includes `Link` component, `useRouter` hook, and navigation context.

### [@kyori-mfv/mfext-config](./packages/config/)

Shared configuration files for ESLint, Prettier, and TypeScript used across the monorepo.

### [@kyori-mfv/mfext-playground](./apps/playground/)

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

## 🎯 Development Phases

### ✅ Phase 0: Foundation (Completed)

- React Server Components (RSC) with streaming
- Server-Side Rendering (SSR)
- Build System with Webpack
- CLI Tool (`mfext build`, `mfext start`)
- TypeScript Integration
- Monorepo Architecture

### ✅ Phase 1: UI Foundation (Completed)

- File-based Routing with `src/app/` directory structure
- Layout System with `layout.tsx` files
- Client Navigation with `<Link>` component and `useRouter()` hook
- `@kyori-mfv/mfext-navigation` package with complete navigation system
- Event-driven navigation architecture with RSC Manager
- Unified server handling both SSR and RSC requests

### ✅ Phase 2: Package Management & Publishing (Completed)

- NPM-ready package structure with proper exports and TypeScript declarations
- Automated release pipeline with comprehensive validation
- **Changesets** for professional version management and changelog generation
- Individual package.json files with proper dependencies/peer dependencies
- **Published Packages:**
    - `@kyori-mfv/mfext-core` - CLI framework tool
    - `@kyori-mfv/mfext-navigation` - React navigation library
    - `@kyori-mfv/mfext-config` - Shared configurations

**Release Commands:**

```bash
# 1. Document changes after making modifications
pnpm changeset

# 2. Update versions when ready to release
pnpm bump

# 3. Publish to GitHub Packages
pnpm release

# Snapshot releases for testing
pnpm release:snapshot
```

### 🔄 Phase 3: Routing Enhancement (Next)

- Dynamic Routes (`[id].tsx`, `[...slug].tsx`)
- Enhanced server data fetching with Suspense
- Route parameter extraction and typing

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
