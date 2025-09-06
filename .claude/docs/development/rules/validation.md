# Validation Rule

**IMPORTANT**: After any MFExt framework changes, always validate the application works correctly using playground commands from root folder.

## Core Validation Principle

**MANDATORY**: For any pnpm run commands, ALWAYS use playground-specific pnpm commands at root folder to demonstrate the completed framework changes. This ensures proper validation of the implementation.

## Required Validation Steps

### 1. Build Commands (run from project root)
```bash
# ALWAYS USE PLAYGROUND-SPECIFIC COMMANDS (mandatory for framework validation)
pnpm playground:clean              # Clean dist and public folders (use when build issues occur)
pnpm playground:build              # Full playground build pipeline
pnpm playground:build:discover     # Routes discovery 
pnpm playground:build:client       # Client bundle 
pnpm playground:build:ssr          # SSR bundle 
pnpm playground:build:rsc          # RSC bundle

# Monorepo-wide commands (only use if specifically required)
pnpm build                         # Build all packages
```

### 2. Start Servers
```bash
# ALWAYS USE PLAYGROUND-SPECIFIC COMMANDS (mandatory for framework validation)
pnpm playground:start              # Starts playground RSC (:5001) and SSR (:5000)

# Monorepo-wide (only use if specifically required)
pnpm start                         # Starts all packages
```

### 3. Test Both Endpoints
```bash
curl -s -w "%{http_code}" http://localhost:5000  # SSR - should return 200
curl -s -w "%{http_code}" http://localhost:5001  # RSC - should return 200
```

## Expected Results
- **SSR Server (:5000)**: Returns complete HTML page
- **RSC Server (:5001)**: Returns React Server Components stream
- **Both**: HTTP status 200

## Pre-Validation: Auto-Fix Quality Issues

**MANDATORY**: Before running build validation, ALWAYS fix all quality issues by running:

```bash
pnpm validate    # Check for lint, format, and TypeScript errors

# If pnpm validate fails, auto-fix issues:
pnpm lint:fix    # Fix ESLint errors automatically
pnpm format      # Fix Prettier formatting issues automatically
# For TypeScript errors: Review and fix manually (tsc cannot auto-fix)
```

## Quality Gates

**All commands must pass before validation**:
- `pnpm lint` - No ESLint errors
- `pnpm format:check` - All files properly formatted
- `pnpm typecheck` - No TypeScript compilation errors

## Quick Troubleshooting
- **pnpm validate fails**: Run `pnpm lint:fix` and `pnpm format`, then fix TypeScript errors manually
- **Build fails**: Run `pnpm playground:clean` then rebuild, check `pnpm typecheck`, `pnpm lint`, and webpack build logs
- **Servers won't start**: Kill existing processes on ports 5000/5001
- **404/500 errors**: Verify `dist/app-routes-manifest.json` exists and pages are in `apps/playground/src/app/`
- **Stale build artifacts**: Use `pnpm playground:clean` before rebuilding

**Always run `pnpm validate` and playground validation commands from root folder before considering any task complete.**