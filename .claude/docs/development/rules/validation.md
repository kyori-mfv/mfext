# Validation Rule

**IMPORTANT**: After any MFExt framework changes, always validate the application works correctly using playground commands from root folder.

## Core Validation Principle

**MANDATORY**: For any run build or start to test, ALWAYS use playground-specific pnpm commands at root folder to demonstrate the completed framework changes. This ensures proper validation of the implementation.

## Required Validation Steps

### 1. Build Commands (run from project root)
```bash
pnpm playground:build              # Full playground build pipeline
pnpm playground:build:discover     # Routes discovery 
pnpm playground:build:client       # Client bundle 
pnpm playground:build:ssr          # SSR bundle 
pnpm playground:build:rsc          # RSC bundle

### 2. Start Servers
```bash
# ALWAYS USE PLAYGROUND-SPECIFIC COMMANDS (mandatory for framework validation)
pnpm playground:start              # Starts playground RSC (:5001) and SSR (:5000)

### 3. Test Both Endpoints
```bash
curl -s -w "%{http_code}" http://localhost:5000  # SSR - should return 200
curl -s -w "%{http_code}" http://localhost:5000/rsc?path=/  # RSC - should return 200
```

## Expected Results
- **SSR Server (:5000)**: Returns complete HTML page
- **RSC Server (:5001)**: Returns React Server Components stream
- **Both**: HTTP status 200


## Quick Troubleshooting
- **pnpm validate fails**: Run `pnpm lint:fix` and `pnpm format`, then fix TypeScript errors manually
- **Build fails**: Run `pnpm playground:clean` then rebuild, check `pnpm typecheck`, `pnpm lint`, and webpack build logs
- **Servers won't start**: Kill existing processes on ports 5000/5001
- **404/500 errors**: Verify `dist/app-routes-manifest.json` exists and pages are in `apps/playground/src/app/`
- **Stale build artifacts**: Use `pnpm playground:clean` before rebuilding