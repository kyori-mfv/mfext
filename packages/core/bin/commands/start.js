import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { getBuildConfig } from "../../build-config.js";

function startServer(serverType) {
    const buildConfig = getBuildConfig();

    // Create bootstrap script in the playground directory with unique name
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const bootstrapScriptName =
        serverType === "rsc"
            ? `rsc-bootstrap-${timestamp}-${randomId}.cjs`
            : `ssr-bootstrap-${timestamp}-${randomId}.mjs`;
    const bootstrapScriptPath = path.join(
        buildConfig.originalCwd,
        bootstrapScriptName,
    );

    // Generate bootstrap content based on server type
    let bootstrapContent;
    if (serverType === "rsc") {
        // RSC server requires react-server-dom-webpack registration
        bootstrapContent = `
require("react-server-dom-webpack/node-register")();
require("./dist/rsc/rsc-server.cjs");
        `.trim();
    } else {
        // SSR server uses ES modules
        bootstrapContent = `
import "./dist/ssr/ssr-server.js";
        `.trim();
    }

    // Write the bootstrap script
    fs.writeFileSync(bootstrapScriptPath, bootstrapContent);

    // Start the server
    const nodeArgs =
        serverType === "rsc"
            ? ["--conditions", "react-server", bootstrapScriptPath]
            : [bootstrapScriptPath];

    const child = spawn("node", nodeArgs, {
        stdio: "inherit",
        cwd: buildConfig.originalCwd,
        env: {
            ...process.env,
            NODE_ENV:
                serverType === "rsc"
                    ? "rsc"
                    : process.env.NODE_ENV || "development",
            originalCwd: buildConfig.originalCwd,
        },
    });

    // Clean up function that handles both child process and bootstrap file
    const cleanup = (signal) => {
        try {
            // Kill the child process if it's still running
            if (child && !child.killed) {
                child.kill(signal || "SIGTERM");
            }

            // Remove the bootstrap script
            if (fs.existsSync(bootstrapScriptPath)) {
                fs.unlinkSync(bootstrapScriptPath);
            }
        } catch {
            // Ignore cleanup errors
        }
    };

    child.on("error", (error) => {
        console.error(`❌ Failed to start ${serverType} server:`, error);
        cleanup();
        process.exit(1);
    });

    child.on("exit", (code) => {
        if (code !== 0) {
            console.error(
                `❌ ${serverType.toUpperCase()} server exited with code ${code}`,
            );
        }
        cleanup();
        process.exit(code);
    });

    return { child, cleanup };
}

function startBothServers() {
    const servers = [];

    // Start RSC server
    console.log("📋 Starting RSC server...");
    const rscServer = startServer("rsc");
    servers.push({ type: "RSC", ...rscServer });

    // Start SSR server
    console.log("📋 Starting SSR server...");
    const ssrServer = startServer("ssr");
    servers.push({ type: "SSR", ...ssrServer });

    // Combined cleanup function
    const cleanup = (signal) => {
        servers.forEach(({ type, cleanup: serverCleanup }) => {
            try {
                serverCleanup(signal);
            } catch (error) {
                console.error(`Error stopping ${type} server:`, error);
            }
        });
    };

    // Handle graceful shutdown for all servers
    process.on("SIGINT", () => cleanup("SIGINT"));
    process.on("SIGTERM", () => cleanup("SIGTERM"));
    process.on("exit", cleanup);
}

export function startCommand(args) {
    const serverType = args[0] || "both";

    if (serverType !== "rsc" && serverType !== "ssr" && serverType !== "both") {
        console.error(`❌ Invalid server type: ${serverType}`);
        console.log("Available types: rsc, ssr, both");
        process.exit(1);
    }

    if (serverType === "both") {
        console.log("🚀 Starting both RSC and SSR servers concurrently...");
        startBothServers();
        return;
    }

    console.log(`🚀 Starting ${serverType.toUpperCase()} server...`);

    const { cleanup } = startServer(serverType);

    // Handle graceful shutdown
    process.on("SIGINT", () => cleanup("SIGINT"));
    process.on("SIGTERM", () => cleanup("SIGTERM"));
    process.on("exit", cleanup);
}
