# Changesets Workflow

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

## Quick Start

### 1. Making Changes

After making changes to any package, create a changeset to document what changed:

```bash
pnpm changeset
```

This will prompt you to:

- Select which packages changed
- Choose the type of change (patch/minor/major)
- Write a summary of the changes

### 2. Versioning

When ready to release, update package versions:

```bash
pnpm bump
```

This will:

- Update package.json versions based on changesets
- Update CHANGELOG.md files
- Remove consumed changeset files

### 3. Publishing

Publish the packages to GitHub Packages:

```bash
pnpm release
```

This will:

- Build all packages
- Publish to GitHub Packages registry
- Create GitHub releases with changelog

## Snapshot Releases

For testing unreleased changes:

```bash
pnpm release:snapshot
```

Creates snapshot versions like `0.1.0-snapshot-20231201120000`.

## Package Structure

- `@kyori-mfv/mfext-core` - CLI framework tool (no build output)
- `@kyori-mfv/mfext-navigation` - React navigation library with hooks and components
- `@kyori-mfv/mfext-config` - Shared ESLint, Prettier, and TypeScript configurations
- `@kyori-mfv/mfext-playground` - Demo application (excluded from publishing)

## Configuration

See `.changeset/config.json` for Changesets configuration.
The playground package is excluded from publishing via the `ignore` field.
