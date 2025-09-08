# 📦 Release Process

## Quick Release Commands

```bash
# Update package versions (replace with actual version)
pnpm bump 0.1.1

# Full release pipeline: validate + build + publish to GitHub Packages
pnpm release
```

## Step-by-Step Release

### 1. Version Update

```bash
# Update all package versions to the new version
pnpm bump 0.2.0
```

### 2. Validate Packages

```bash
# Test package structure, builds, and functionality
pnpm test:packages
```

### 3. Build Packages

```bash
# Build all publishable packages
pnpm build:packages
```

### 4. Publish to GitHub Packages

```bash
# Publish all packages to GitHub Packages (requires GITHUB_TOKEN)
pnpm -r publish --no-git-checks
```

## Manual Verification

Before releasing, manually verify:

1. **Package Structure**: All packages have proper exports and TypeScript declarations
2. **Playground Build**: `pnpm playground:build` succeeds
3. **Playground Test**:
    ```bash
    pnpm playground:start &
    curl http://localhost:5000/        # Should return HTML
    curl http://localhost:5000/rsc?path=/  # Should return RSC stream
    ```

## Package Validation Pipeline

The `pnpm test:packages` command validates:

- ✅ Package.json structure (name, version, description, author, license)
- ✅ Export paths and TypeScript declarations
- ✅ Build process (compiles without errors)
- ✅ Build output (dist files exist and are valid)
- ✅ Playground integration (builds successfully with packages)

## Published Packages

- **@kyori-mfv/mfext-core** - Framework implementation and CLI tool
- **@kyori-mfv/mfext-navigation** - Navigation components and hooks
- **@kyori-mfv/mfext-config** - Shared configurations

## GitHub Packages Setup

To publish packages to GitHub Packages, you need:

1. GitHub account with write access to the repository
2. GitHub personal access token with `write:packages` permission:

    ```bash
    # Set your GitHub token
    export GITHUB_TOKEN=your_github_token_here

    # Or authenticate with npm
    npm login --scope=@kyori-mfv --auth-type=legacy --registry=https://npm.pkg.github.com
    ```

3. For consuming packages, users need to configure their `.npmrc`:

    ```
    @kyori-mfv:registry=https://npm.pkg.github.com
    //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
    ```

    **Note**: Users need a GitHub token with `read:packages` permission to install the packages.

## Git Workflow

After publishing:

```bash
# Commit version changes
git add -A
git commit -m "chore: release v0.2.0"

# Tag the release
git tag v0.2.0

# Push with tags
git push --tags
git push
```
