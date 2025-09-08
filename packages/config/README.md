# @kyori-mfv/mfext-config

Shared configuration package providing consistent ESLint, Prettier, and TypeScript configurations across the MFExt monorepo.

## 📦 Package Status

**Current Status:** ✅ **Published to GitHub Packages**

- **Package Name:** `@kyori-mfv/mfext-config`
- **Registry:** GitHub Packages (`npm.pkg.github.com`)
- **Type:** Configuration Package (No build required)

## 🚀 Features

- **ESLint Configuration** - TypeScript-ready ESLint rules with modern JavaScript support
- **Prettier Configuration** - Consistent code formatting rules
- **TypeScript Configuration** - Base TypeScript compiler settings
- **Workspace Integration** - Designed for monorepo usage with workspace references

## 📦 Installation

This package is typically used as a workspace dependency:

```bash
pnpm add -D @kyori-mfv/mfext-config
```

## 🛠 Usage

### ESLint Configuration

Import the ESLint configuration in your project's `eslint.config.js`:

```javascript
import mfextConfig from "@kyori-mfv/mfext-config/eslint";

export default [...mfextConfig];
```

Or for browser-specific configurations:

```javascript
import mfextBrowserConfig from "@kyori-mfv/mfext-config/eslint/browser";
```

### Prettier Configuration

Import in your `prettier.config.js`:

```javascript
import prettierConfig from "@kyori-mfv/mfext-config/prettier";

export default prettierConfig;
```

### TypeScript Configuration

Extend the base configuration in your `tsconfig.json`:

```json
{
    "extends": "@kyori-mfv/mfext-config/tsconfig",
    "compilerOptions": {
        "outDir": "./dist"
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

## 📁 Package Exports

The package provides the following exports:

```json
{
    "./eslint": "./eslint.config.js",
    "./eslint/node": "./eslint.config.js",
    "./eslint/browser": "./eslint.config.js",
    "./prettier": "./prettier.config.js",
    "./tsconfig": "./tsconfig.json"
}
```

## ⚙️ Configuration Details

### ESLint Rules

The ESLint configuration includes:

- **@typescript-eslint** - TypeScript-specific linting rules
- **ESLint recommended** - Core ESLint recommended rules
- **Prettier integration** - Disables conflicting rules with Prettier
- **Modern JavaScript** - ES2022+ support
- **React support** - React and JSX linting (when applicable)

### Prettier Settings

- **Semi-colons** - Enforced for consistency
- **Single quotes** - Preferred over double quotes
- **Tab width** - 2 spaces
- **Trailing commas** - ES5 compatible
- **Print width** - 80 characters

### TypeScript Configuration

Base TypeScript settings include:

- **Strict mode** - Enabled for better type safety
- **ES2022 target** - Modern JavaScript output
- **ESNext modules** - ES module support
- **React JSX** - React JSX transformation
- **Declaration files** - Generate `.d.ts` files
- **Source maps** - Generate source maps for debugging

## 🔧 Customization

Projects can extend these configurations with their own rules:

### Custom ESLint Rules

```javascript
import mfextConfig from "@kyori-mfv/mfext-config/eslint";

export default [
    ...mfextConfig,
    {
        rules: {
            // Your custom rules
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
];
```

### Custom Prettier Settings

```javascript
import prettierConfig from "@kyori-mfv/mfext-config/prettier";

export default {
    ...prettierConfig,
    printWidth: 100, // Override default width
};
```

### Custom TypeScript Settings

```json
{
    "extends": "@kyori-mfv/mfext-config/tsconfig",
    "compilerOptions": {
        "strict": false,
        "target": "ES2020"
    }
}
```

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

## 📋 Dependencies

### Peer Dependencies

These must be installed in consuming projects:

- `eslint` ^9.0.0
- `prettier` ^3.0.0
- `typescript` ^5.0.0

### Dev Dependencies

Included in this package:

- `@eslint/js` - ESLint JavaScript configurations
- `@typescript-eslint/eslint-plugin` - TypeScript ESLint rules
- `@typescript-eslint/parser` - TypeScript parser for ESLint
- `eslint-config-prettier` - Disables ESLint rules that conflict with Prettier

## 🎯 Usage in Projects

### Package.json Scripts

Add these scripts to projects using this config:

```json
{
    "scripts": {
        "lint": "eslint .",
        "lint:fix": "eslint . --fix",
        "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
        "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
        "typecheck": "tsc --noEmit"
    }
}
```

### IDE Integration

Most IDEs will automatically pick up these configurations:

- **VS Code** - Install ESLint and Prettier extensions
- **WebStorm** - Enable ESLint and Prettier in settings
- **Vim/Neovim** - Use coc-eslint and coc-prettier

## 🔍 Development

### Building from Source

```bash
# Install dependencies
pnpm install

# Lint the configuration files
pnpm lint
```

### Testing

The configuration is tested by its usage in the core and playground packages. Run validation across the monorepo:

```bash
# From monorepo root
pnpm validate
```

## 📖 Files Structure

```
packages/config/
├── eslint.config.js    # ESLint configuration
├── prettier.config.js  # Prettier configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Package metadata and exports
└── README.md          # This file
```

## 🤝 Contributing

1. Changes should maintain consistency across the monorepo
2. Test configurations with both core and playground packages
3. Update documentation when adding new exports or rules
4. Follow the existing code style and patterns

## 📖 Related

- [Main README](../../README.md) - Monorepo overview
- [Core Package](../core/) - Framework implementation
- [Playground](../../apps/playground/) - Example usage
