import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { getBuildConfig } from "../../build-config.js";

function startServer(serverType) {
    const buildConfig = getBuildConfig();

    // Use bootstrap files from dist folder
    const bootstrapScriptName =
        serverType === "rsc" ? "rsc-bootstrap.cjs" : "ssr-bootstrap.mjs";
    const bootstrapScriptPath = path.join(
        buildConfig.originalCwd,
        "dist",
        bootstrapScriptName,
    );

    // Check if bootstrap file exists
    if (!fs.existsSync(bootstrapScriptPath)) {
        console.error(`❌ Bootstrap file not found: ${bootstrapScriptPath}`);
        console.log(
            "💡 Run 'mfext build bootstrap' or 'mfext build all' to create bootstrap files",
        );
        process.exit(1);
    }

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
            originalCwd: buildConfig.originalCwd,
        },
    });

    // Clean up function that handles child process
    const cleanup = (signal) => {
        try {
            // Kill the child process if it's still running
            if (child && !child.killed) {
                child.kill(signal || "SIGTERM");
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
