# Implementation Plan: Phase 2 - Package Management & Publishing

## Overview
**Phase 2** focuses on preparing MFExt packages for git repository distribution. This involves restructuring package configurations, implementing project release commands, and ensuring packages can be installed directly from the git repository.

## Current Status Analysis

### ✅ What's Already Complete
- **Package Structure**: Monorepo with 3 main packages (`@mfext/core`, `@mfext/navigation`, `@mfext/config`)
- **Workspace Dependencies**: All packages properly reference each other via `workspace:*`
- **TypeScript Setup**: Full TypeScript support with declaration file generation
- **Build Output**: Navigation package has working TypeScript build generating `.d.ts` files
- **Version Management**: All packages start at version `0.0.0` for initial release
- **Engine Requirements**: Node.js >=20.0.0, pnpm >=9.0.0 specified

### 🎯 Phase 2 Focus: Git Repository Distribution (Monorepo-First)

Phase 2 prepares the **pnpm monorepo** for git repository distribution while **maintaining workspace structure** as the primary development approach. This enables:

- **Quick development and testing**: Keep `workspace:*` dependencies for internal development
- **Git repository installation**: Full monorepo installation via `npm install git+https://github.com/kyori-mfv/mfext.git#tag`
- **Dual compatibility**: Support both workspace development and external git installation
- **Build artifact management**: Committed build outputs for external consumers

## Implementation Tasks

### Task 1: Package Structure & Metadata
**Effort: MED | Dependencies: None**

**Scope:** Enhance package.json configurations for dual workspace/git compatibility

**Deliverables:**
- Update `@mfext/core` with proper main/types/exports configuration
- **Keep `workspace:*` dependencies** for internal development (no conversion needed)
- Add comprehensive package metadata (description, keywords, repository)
- Configure package.json for external git repository installation
- Add proper license fields and author information
- Ensure monorepo works for both internal development and external consumption

**Technical Details:**
- Main entry point: `dist/index.js`
- Types entry point: `dist/index.d.ts` 
- Exports configuration for ESM/CJS compatibility
- Repository URLs pointing to https://github.com/kyori-mfv/mfext
- **Maintain workspace dependencies**: Keep `"@mfext/navigation": "workspace:*"` for development
- **Full monorepo installation**: External users install entire repository via git

### Task 2: pnpm Build System Enhancement  
**Effort: MED | Dependencies: Task 1**

**Scope:** Enhance build pipeline for monorepo development and git distribution

**Deliverables:**
- TypeScript build configuration for `@mfext/core` package  
- **Unified pnpm workspace builds** using `pnpm -r build` commands
- Pre-release build validation maintaining workspace structure
- Clean/rebuild scripts for both development and release
- Build artifact verification for external git installation
- Committed build outputs for external consumers

**Technical Details:**
- TSC compilation for core package generating declaration files
- **pnpm workspace build order**: `pnpm -r --workspace-concurrency=1 build`
- Output directory standardization (`dist/`)
- **Maintain workspace advantages**: Keep fast development iteration
- Ensure all build artifacts are committed for git installation
- **Development-first approach**: Optimize for quick internal testing

### Task 3: pnpm Release Commands for Monorepo
**Effort: MED | Dependencies: Task 2** 

**Scope:** pnpm-aware release management for monorepo git distribution

**Deliverables:**
- `pnpm release` command with workspace version coordination
- **pnpm workspace version bumping** (`pnpm -r version`)
- Release preparation scripts (pnpm build, validate, commit)
- **Workspace dependency version updates** during release
- Git tagging and release workflow for monorepo
- Release validation and rollback procedures

**Technical Details:**
- **Coordinated versioning**: Update all workspace packages simultaneously
- `pnpm -r build` and `pnpm -r test` before release
- **Workspace dependency updates**: Update internal references during version bump
- Git tag creation with version numbers (v1.0.0, v1.0.1, etc.)
- **pnpm-lock.yaml management** for release consistency
- Build artifact inclusion in git for installation

### Task 4: pnpm Monorepo Documentation & Distribution
**Effort: MED | Dependencies: Task 3**

**Scope:** Create comprehensive documentation for pnpm monorepo git installation

**Deliverables:**
- Individual README files for each package with monorepo context
- API documentation with TypeScript examples
- **pnpm monorepo git installation guides** with workspace considerations
- Migration documentation from workspace to git dependencies
- **pnpm-specific troubleshooting** documentation

**Technical Details:**
- **Monorepo installation patterns**: 
  - Full repo: `npm install git+https://github.com/kyori-mfv/mfext.git#v1.0.0`
  - Individual packages from monorepo (if supported)
- **pnpm workspace compatibility** notes for external consumers
- Code examples for all exported APIs
- **Workspace dependency resolution** troubleshooting
- Version selection via git tags and branches
- **pnpm vs npm installation** differences and recommendations

## Risk Assessment

### Medium Risk
- **Dual Compatibility**: Ensuring packages work both in workspace development and git installation contexts
  - *Mitigation*: Test extensively in both environments, maintain clear documentation for both use cases
- **Build Artifact Management**: Keeping committed build outputs in sync with source code
  - *Mitigation*: Automated build verification in release process, clear build artifact update procedures

- **Breaking Changes**: Minor restructuring may break existing playground app workflow
  - *Mitigation*: Test playground extensively, maintain workspace-first development approach
- **External Installation Complexity**: Users may struggle with monorepo git installation
  - *Mitigation*: Provide clear installation documentation, test with external projects

### Low Risk
- **Version Management**: Manual release process may be error-prone
  - *Mitigation*: Create comprehensive release scripts with validation steps
- **Documentation Maintenance**: Keeping docs in sync with code changes
  - *Mitigation*: Include documentation updates in release checklist

## Success Criteria

### Phase 2 Complete When:
- [ ] All packages have proper build outputs and can be installed via git
- [ ] External projects can install and use packages via `git+https://` URLs
- [ ] Release commands enable version management and git tagging
- [ ] Comprehensive documentation enables external developers to adopt framework
- [ ] Playground app works with git-installed packages (not workspace dependencies)

### Quality Gates:
- [ ] `npm install git+https://github.com/kyori-mfv/mfext.git` works in fresh project  
- [ ] **Workspace development remains fast and efficient** (primary requirement)
- [ ] TypeScript definitions resolve correctly for external consumers
- [ ] All builds pass with zero warnings/errors using `pnpm -r build`
- [ ] **Playground app continues to work seamlessly** with workspace structure
- [ ] Documentation covers both workspace development and git installation
- [ ] Manual tests validate package integrity after git installation

## Next Steps After Phase 2
With successful git repository distribution, the framework becomes publicly available and can gather external feedback. This enables:
- Community contributions and issue reports via GitHub
- Real-world usage testing beyond playground app
- Foundation for Phase 3 (Dynamic Routes) with external validation
- Potential for framework adoption and ecosystem development
- Future migration to NPM publishing when ready

Phase 2 transforms MFExt from an internal monorepo project into a publicly accessible React framework via git repository distribution, providing a stepping stone toward full NPM publishing capability.