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

    // Check for compiled server files
    const rscServerPath = path.join(distPath, "rsc", "rsc-server.cjs");
    const ssrServerPath = path.join(distPath, "ssr", "ssr-server.js");

    if (!fs.existsSync(rscServerPath) && !fs.existsSync(ssrServerPath)) {
        console.error(
            "❌ Compiled server files not found. Please run build first:",
        );
        console.log("💡 Run 'mfext build' to create necessary build files");
        process.exit(1);
    }
}

function createRSCServerScript(distPath) {
    const scriptContent = `
const path = require("path");

// Required setup for RSC server
require("react-server-dom-webpack/node-register")();

const rscServerPath = path.join("${distPath}", "rsc", "rsc-server.cjs");
const rscModule = require(rscServerPath);

if (rscModule.createRSCServer) {
    const server = rscModule.createRSCServer({ port: 5001 });
    server.start().catch(error => {
        console.error("❌ Failed to start RSC server:", error.message);
        process.exit(1);
    });
} else {
    console.error("❌ createRSCServer function not found in compiled bundle");
    process.exit(1);
}
    `.trim();

    const scriptPath = path.join(distPath, "rsc-starter.cjs");
    fs.writeFileSync(scriptPath, scriptContent);
    return scriptPath;
}

async function startServerFromBuild(serverType) {
    const buildConfig = getBuildConfig();
    const distPath = path.join(buildConfig.originalCwd, "dist");
    const processes = [];

    if (serverType === "rsc" || serverType === "both") {
        const rscServerPath = path.join(distPath, "rsc", "rsc-server.cjs");
        if (fs.existsSync(rscServerPath)) {
            console.log("🚀 Starting RSC server from compiled bundle...");

            // Create RSC server starter script
            const rscStarterScript = createRSCServerScript(distPath);

            // Start with --conditions react-server
            const rscProcess = spawn(
                "node",
                ["--conditions", "react-server", rscStarterScript],
                {
                    stdio: "inherit",
                    cwd: buildConfig.originalCwd,
                },
            );

            rscProcess.on("error", (error) => {
                console.error("❌ Failed to start RSC server:", error);
            });

            processes.push({ type: "rsc", process: rscProcess });
        }
    }

    if (serverType === "ssr" || serverType === "both") {
        const ssrServerPath = path.join(distPath, "ssr", "ssr-server.js");
        if (fs.existsSync(ssrServerPath)) {
            console.log("🚀 Starting SSR server from compiled bundle...");
            const { createSSRServer } = await import(ssrServerPath);
            if (createSSRServer) {
                const server = createSSRServer({ port: 5000 });
                await server.start();
            }
        }
    }

    // Setup cleanup for spawned processes
    if (processes.length > 0) {
        const cleanup = () => {
            processes.forEach(({ type, process: proc }) => {
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
}

export async function startCommand(args) {
    const serverType = args[0] || "both";

    if (serverType !== "rsc" && serverType !== "ssr" && serverType !== "both") {
        console.error(`❌ Invalid server type: ${serverType}`);
        console.log("Available types: rsc, ssr, both");
        process.exit(1);
    }

    // Check if build files exist
    checkBuildFiles();

    try {
        console.log(
            `🚀 Starting ${serverType === "both" ? "both RSC and SSR" : serverType.toUpperCase()} server${serverType === "both" ? "s" : ""}...`,
        );

        await startServerFromBuild(serverType);

        console.log("\n📊 Servers started successfully!");
        console.log("🎯 Servers are running. Press Ctrl+C to stop.\n");

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
        console.error(`❌ Failed to start servers:`, error.message);
        process.exit(1);
    }
}
