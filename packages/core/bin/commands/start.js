import { getBuildConfig } from "../../src/build/build-config.js";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

function checkBuildFiles() {
    const buildConfig = getBuildConfig();
    const distPath = path.join(buildConfig.originalCwd, "dist");

    // Check if dist directory exists
    if (!fs.existsSync(distPath)) {
        console.error("❌ Build files not found. Please run build first:");
        console.log("💡 Run 'mfext build' to create necessary build files");
        process.exit(1);
    }

    // Check for compiled handler files
    const rscHandlerPath = path.join(
        buildConfig.rscDistDir,
        buildConfig.rscHandlerFileName,
    );
    const ssrHandlerPath = path.join(
        buildConfig.ssrDistDir,
        buildConfig.ssrHandlerFileName,
    );

    if (!fs.existsSync(rscHandlerPath) || !fs.existsSync(ssrHandlerPath)) {
        console.error(
            "❌ Compiled handler files not found. Please run build first:",
        );
        console.log("💡 Run 'mfext build' to create necessary build files");
        process.exit(1);
    }
}

function createUnifiedServerScript(distPath) {
    const buildConfig = getBuildConfig();

    const scriptContent = `
require("react-server-dom-webpack/node-register")();

const { createUnifiedServer } = require("${buildConfig.serverPath}");

async function start() {
    try {
        const server = createUnifiedServer({ port: 5000 });
        await server.start();
    } catch (error) {
        console.error("❌ Failed to start unified server:", error.message);
        process.exit(1);
    }
}

start();
    `.trim();

    const scriptPath = path.join(distPath, buildConfig.serverStarterFileName);
    fs.writeFileSync(scriptPath, scriptContent);
    return scriptPath;
}

async function startUnifiedServer() {
    const buildConfig = getBuildConfig();
    const distPath = path.join(buildConfig.originalCwd, "dist");

    // Create unified server starter script
    const unifiedStarterScript = createUnifiedServerScript(distPath);

    // Start with --conditions react-server
    const unifiedProcess = spawn(
        "node",
        ["--conditions", "react-server", unifiedStarterScript],
        {
            stdio: "inherit",
            cwd: buildConfig.originalCwd,
        },
    );

    unifiedProcess.on("error", (error) => {
        console.error("❌ Failed to start unified server:", error);
    });

    // Setup cleanup for spawned processes
    if (unifiedProcess.length > 0) {
        const cleanup = () => {
            unifiedProcess.forEach(({ type, process: proc }) => {
                if (proc && !proc.killed) {
                    console.log(`🛑 Stopping ${type.toUpperCase()} server...`);
                    proc.kill("SIGTERM");
                }
            });
        };

        process.on("SIGINT", cleanup);
        process.on("SIGTERM", cleanup);
        process.on("exit", cleanup);
    }

    return unifiedProcess;
}

export async function startCommand() {
    // Check if build files exist
    checkBuildFiles();

    try {
        await startUnifiedServer();

        // Set up graceful shutdown
        const gracefulShutdown = () => {
            console.log("\n🔄 Shutting down gracefully...");
            process.exit(0);
        };

        process.on("SIGINT", gracefulShutdown);
        process.on("SIGTERM", gracefulShutdown);

        // Keep the process alive
        process.stdin.resume();
    } catch (error) {
        console.error(`❌ Failed to start server:`, error.message);
        process.exit(1);
    }
}
