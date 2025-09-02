import { spawn } from "child_process";
import path from "path";
import { createRequire } from "module";
import { getBuildConfig } from "../../build-config.js";
import { discoverCommand } from "./discover.js";

const require = createRequire(import.meta.url);

async function runWebpackBuild(buildType, args = []) {
    const webpack = require.resolve("webpack-cli/bin/cli.js");
    const buildConfig = getBuildConfig();

    // Determine webpack config based on build type
    const configFile = buildConfig.webpackConfigs[buildType];

    if (!configFile) {
        console.error(`❌ Unknown build type: ${buildType}`);
        console.log("Available types: ssr, rsc, client");
        process.exit(1);
    }

    console.log(`🔨 Building ${buildType.toUpperCase()}...`);

    return new Promise((resolve, reject) => {
        const child = spawn(
            "node",
            [webpack, ...args, "--config", configFile],
            {
                stdio: "inherit",
                cwd: path.dirname(configFile),
                env: {
                    ...process.env,
                    originalCwd: buildConfig.originalCwd,
                },
            },
        );

        child.on("close", (code) => {
            if (code === 0) {
                console.log(`✅ ${buildType.toUpperCase()} build completed`);
                resolve();
            } else {
                console.error(
                    `❌ ${buildType.toUpperCase()} build failed with code ${code}`,
                );
                reject(new Error(`Build failed with code ${code}`));
            }
        });

        child.on("error", (error) => {
            console.error(`❌ Failed to start ${buildType} build:`, error);
            reject(error);
        });
    });
}

export async function buildCommand(args) {
    // Parse arguments to detect build type
    let buildType = "all"; // default to all
    let webpackArgs = [];

    // Check if first argument is a build type
    if (args.length > 0) {
        const firstArg = args[0].toLowerCase();
        if (
            firstArg === "ssr" ||
            firstArg === "rsc" ||
            firstArg === "client" ||
            firstArg === "discover" ||
            firstArg === "all"
        ) {
            buildType = firstArg;
            // Remove the build type from webpack args
            webpackArgs = args.slice(1);
        } else {
            // If first arg is not a build type, treat all args as webpack args
            webpackArgs = args;
        }
    }

    // If help is requested, show help
    if (args.includes("--help") || args.includes("-h")) {
        showBuildHelp();
        return;
    }

    try {
        switch (buildType) {
            case "discover":
                console.log("🔍 Running discover...");
                discoverCommand([]);
                break;

            case "rsc":
                await runWebpackBuild("rsc", webpackArgs);
                break;

            case "client":
                await runWebpackBuild("client", webpackArgs);
                break;

            case "ssr":
                await runWebpackBuild("ssr", webpackArgs);
                break;

            case "all":
                console.log(
                    "🚀 Running full build pipeline: discover -> client -> ssr -> rsc",
                );

                // Step 1: Discover pages
                console.log("\n📋 Step 1: Discovering pages...");
                discoverCommand([]);

                // Step 2: Build client
                console.log("\n📋 Step 2: Building client...");
                await runWebpackBuild("client", webpackArgs);

                // Step 3: Build SSR
                console.log("\n📋 Step 3: Building SSR...");
                await runWebpackBuild("ssr", webpackArgs);

                // Step 4: Build RSC
                console.log("\n📋 Step 4: Building RSC...");
                await runWebpackBuild("rsc", webpackArgs);

                console.log("\n🎉 Full build pipeline completed successfully!");
                break;

            default:
                console.error(`❌ Unknown build type: ${buildType}`);
                console.log("Available types: discover, rsc, client, ssr, all");
                process.exit(1);
        }
    } catch (error) {
        console.error("❌ Build failed:", error.message);
        process.exit(1);
    }
}

function showBuildHelp() {
    console.log(`
🔨 MFExt Build Command

Usage: mfext build [<type>] [options]

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
  mfext build all                # Run full pipeline

Webpack Options (passed through to webpack):
  --mode <mode>       Build mode: development or production
  --watch, -w         Watch for changes
  --env <env>         Environment variables

For more information, visit: https://github.com/your-repo/mfext
`);
}
