# @kyori-mfv/mfext-navigation

React navigation components and hooks for the MFExt framework with React Server Components support.

## 🚀 Features

- **Link Component** - Client-side navigation without page reload
- **useRouter Hook** - Programmatic navigation with push, replace, and back methods
- **NavigationProvider** - Context provider for navigation state
- **RSC Integration** - Full React Server Components support
- **Layout Persistence** - Maintains component state during navigation
- **Event-driven Architecture** - Custom navigation events for framework integration

## 📦 Package Status

**Current Status:** ✅ **Published to GitHub Packages**

- **Package Name:** `@kyori-mfv/mfext-navigation`
- **Registry:** GitHub Packages (`npm.pkg.github.com`)
- **Type:** React Library with TypeScript declarations

## 📥 Installation

```bash
pnpm add @kyori-mfv/mfext-navigation
```

## 🛠 Usage

### Link Component

```tsx
import { Link } from "@kyori-mfv/mfext-navigation";

function Navigation() {
    return (
        <nav>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/dashboard" replace>
                Dashboard
            </Link>
        </nav>
    );
}
```

### useRouter Hook

```tsx
import { useRouter } from "@kyori-mfv/mfext-navigation";

function MyComponent() {
    const router = useRouter();

    return (
        <div>
            <p>Current path: {router.pathname}</p>
            <button onClick={() => router.push("/dashboard")}>
                Go to Dashboard
            </button>
            <button onClick={() => router.back()}>Go Back</button>
        </div>
    );
}
```

### NavigationProvider

```tsx
import { NavigationProvider } from "@kyori-mfv/mfext-navigation";

function App({ children }) {
    return <NavigationProvider>{children}</NavigationProvider>;
}
```

## 🔧 API Reference

### Link Props

- `href: string` - Target route
- `replace?: boolean` - Use replace navigation instead of push
- `children: ReactNode` - Link content
- Standard anchor tag props (onClick, style, className, etc.)

### useRouter Returns

- `pathname: string` - Current route path
- `push(url: string): void` - Navigate to new route
- `replace(url: string): void` - Replace current route
- `back(): void` - Navigate back in history

## 📦 Release Management

This package uses **Changesets** for version management:

```bash
# Document changes
pnpm changeset

# Update versions
pnpm bump

# Publish to GitHub Packages
pnpm release
```

## 🏗 Development

### Building from Source

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run type checking
pnpm typecheck
```

The package builds to `dist/` with both JavaScript and TypeScript declaration files.

## 🧪 Integration

This package is designed to work with the MFExt framework and integrates with:

- **@kyori-mfv/mfext-core** - Framework core and CLI
- **React Server Components** - Server-side rendering support
- **MFExt Router** - App router and routing system

## 📄 License

MIT
