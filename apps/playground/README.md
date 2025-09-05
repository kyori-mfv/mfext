# @mfext/playground

Example application demonstrating the usage of the MFExt React Server Components framework. This playground serves as both a testing environment and a reference implementation for building applications with the framework.

## 🚀 Features

- **File-based Routing** - Demonstrates automatic route generation from page files
- **React Server Components** - Server-side components with streaming
- **Server-Side Rendering** - Traditional SSR for optimal performance
- **Component Library** - Reusable components showcasing framework patterns
- **Development Workflow** - Hot reloading and rapid development cycle

## 🛠 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- MFExt framework packages installed

### Installation & Development

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development server
cd apps/playground
pnpm start

# Or build for production
pnpm build
```

The application will be available at:

- **RSC Server**: http://localhost:3001 (React Server Components)
- **SSR Server**: http://localhost:3000 (Server-Side Rendering)

## 📁 Project Structure

```
apps/playground/
├── src/
│   ├── pages/          # File-based routes
│   │   ├── index.tsx   # Home page (/)
│   │   ├── about.tsx   # About page (/about)
│   │   └── ...
│   └── components/     # Reusable components
├── public/             # Static assets
├── dist/               # Built assets (generated)
└── package.json        # Dependencies and scripts
```

## 🎯 Pages & Routes

The playground demonstrates file-based routing:

### Available Pages

- **`/`** - Home page (`src/pages/index.tsx`)
- **`/about`** - About page (`src/pages/about.tsx`)
- **Additional routes** - Add more pages by creating files in `src/pages/`

### Creating New Pages

Create a new file in `src/pages/`:

```tsx
// src/pages/contact.tsx
export default function ContactPage() {
    return (
        <div>
            <h1>Contact Us</h1>
            <p>Get in touch with us!</p>
        </div>
    );
}
```

This automatically creates a route at `/contact`.

## 🧩 Components

The playground includes example components demonstrating best practices:

```tsx
// src/components/Button.tsx
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
}

export default function Button({ children, onClick }: ButtonProps) {
    return (
        <button onClick={onClick} className="btn">
            {children}
        </button>
    );
}
```

## 🔧 Configuration

### Package.json Scripts

```json
{
    "scripts": {
        "build": "mfext build", // Full production build
        "start": "mfext start", // Start both RSC and SSR servers
        "lint": "eslint .", // Lint the codebase
        "typecheck": "tsc --noEmit" // TypeScript type checking
    }
}
```

### Dependencies

```json
{
    "dependencies": {
        "@mfext/core": "workspace:*", // Framework core
        "react": "^19.1.1", // React 19 with RSC support
        "react-dom": "^19.1.1" // React DOM renderer
    },
    "devDependencies": {
        "@mfext/config": "workspace:*", // Shared configurations
        "typescript": "^5.0.0" // TypeScript compiler
    }
}
```

## 🎨 Development Experience

### Hot Reloading

The development server supports hot reloading for:

- React components
- Page files
- TypeScript files
- CSS files

### Build Process

The build process runs through multiple stages:

1. **Discover** - Finds all pages and generates routes
2. **Client** - Builds client-side bundle with hydration
3. **SSR** - Builds server-side rendering bundle
4. **RSC** - Builds React Server Components bundle

```bash
# Build individual targets
mfext build discover    # Page discovery only
mfext build client      # Client bundle only
mfext build ssr         # SSR bundle only
mfext build rsc         # RSC bundle only
```

## 🌐 Server Modes

### Development Servers

```bash
# Start both servers (default)
pnpm start

# Start specific server
mfext start ssr         # SSR only
mfext start rsc         # RSC only
```

### Production Mode

```bash
# Build for production
mfext build --mode production

# Start production servers
mfext start --mode production
```

## 🧪 Testing Framework Features

Use this playground to test:

### React Server Components

- Server-side rendering with streaming
- Component-level data fetching
- Optimized client bundles

### Server-Side Rendering

- Full HTML responses
- SEO optimization
- Fast initial page loads

### File-based Routing

- Automatic route generation
- Nested routes
- Dynamic routes (when implemented)

## 📋 Available Commands

```bash
# Development
pnpm start              # Start development servers
pnpm build              # Build for production

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint issues
pnpm typecheck          # Type check with TypeScript

# Framework Commands
mfext build [target]    # Build specific target
mfext start [mode]      # Start specific server mode
```

## 🔍 Debugging

### Development Tools

1. **React Developer Tools** - Available in both RSC and SSR modes
2. **Browser DevTools** - Standard debugging capabilities
3. **Server Logs** - Console output from both servers
4. **Network Tab** - Inspect RSC streaming and SSR responses

### Common Issues

- **Port conflicts** - RSC (3001) and SSR (3000) ports must be available
- **Build errors** - Check TypeScript and ESLint output
- **Hot reload issues** - Restart development server

## 🤝 Contributing

This playground is ideal for:

1. **Testing framework changes** - Validate core package updates
2. **Demonstrating features** - Show framework capabilities
3. **Bug reproduction** - Isolate issues in a clean environment
4. **Performance testing** - Benchmark RSC vs SSR performance

### Adding Examples

1. Create new pages in `src/pages/`
2. Add components to `src/components/`
3. Update this README with new examples
4. Test both RSC and SSR modes

## 📖 Learning Resources

This playground demonstrates:

- **File-based routing patterns**
- **React Server Components usage**
- **Server-Side Rendering setup**
- **TypeScript integration**
- **Development workflow**

## 📖 Related

- [Main README](../../README.md) - Monorepo overview
- [Core Package](../../packages/core/) - Framework implementation
- [Config Package](../../packages/config/) - Shared configurations
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) - Official documentation
