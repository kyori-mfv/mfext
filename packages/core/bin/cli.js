#!/usr/bin/env node
import { buildCommand } from "./commands/build.js";
import { startCommand } from "./commands/start.js";

const args = process.argv.slice(2);

// Show help if no arguments
if (args.length === 0) {
    showHelp();
    process.exit(0);
}

// Show help if --help or -h is the first argument
if (args[0] === "--help" || args[0] === "-h") {
    showHelp();
    process.exit(0);
}

// Parse command
const command = args[0];
const commandArgs = args.slice(1);

// Route to appropriate command
switch (command) {
    case "build":
        buildCommand(commandArgs);
        break;

    case "start":
        startCommand(commandArgs);
        break;

    default:
        console.error(`❌ Unknown command "${command}"`);
        showHelp();
        process.exit(1);
}

function showHelp() {
    console.log(`
🚀 MFExt CLI

Usage: mfext <command> [options]

Commands:
  build             Build with webpack (includes discover functionality)
  start             Start development server (RSC or SSR)

Build Types:
  discover          Discover pages and generate routes manifest
  rsc              Build React Server Components
  client           Build client-side bundle
  ssr              Build Server-Side Rendering
  all              Run full pipeline: discover -> client -> ssr -> rsc (default)

Examples:
  mfext build                    # Run full pipeline
  mfext build discover           # Discover pages only
  mfext build rsc                # Build RSC only
  mfext build client             # Build client only
  mfext build ssr                # Build SSR only
  mfext start                    # Start both RSC and SSR servers
  mfext start ssr                # Start SSR server only
  mfext start rsc                # Start RSC server only
  mfext start both               # Start both RSC and SSR servers

Build Options:
  <type>             Build type: discover, rsc, client, ssr, or all (default: all)
  --mode <mode>       Build mode: development or production
  --watch, -w         Watch for changes

Start Options:
  <type>             Server type: ssr, rsc, or both (default: both)

For more information, visit: https://github.com/your-repo/mfext
`);
}
