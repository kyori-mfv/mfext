import { glob } from "glob";
import path from "path";
import fs from "fs-extra";
import { getBuildConfig } from "../../build-config.js";

// Convert file path to route path
function filePathToRoute(filePath) {
    const buildConfig = getBuildConfig();
    const relativePath = path.relative(buildConfig.pagesDir, filePath);
    const routePath = relativePath
        .replace(/\.(tsx?|jsx?)$/, "") // Remove .tsx, .ts, .jsx, .js extensions
        .replace(/\/index$/, "") // Remove /index from the end
        .replace(/^index$/, "") // Convert index to empty string
        .replace(/\/$/, "/") // Ensure trailing slash for root
        .replace(/^$/, "/"); // Empty string becomes root

    return routePath === "/" ? "/" : `/${routePath}`;
}

// Convert file path to component path (including folder structure)
function filePathToComponent(filePath) {
    const buildConfig = getBuildConfig();
    const relativePath = path.relative(buildConfig.pagesDir, filePath);
    return relativePath;
}

// Convert route path to page title
function routeToTitle(routePath) {
    if (routePath === "/") return "Home";

    return routePath
        .slice(1) // Remove leading slash
        .split("/")
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
}

// Discover pages and generate routes manifest
async function discoverPages() {
    const buildConfig = getBuildConfig();

    try {
        const pageFiles = await glob(`**/*.{tsx,jsx}`, {
            cwd: buildConfig.pagesDir,
        });

        const pages = {};

        for (const filePath of pageFiles) {
            const fullPath = path.join(buildConfig.pagesDir, filePath);
            const routePath = filePathToRoute(fullPath);
            const component = filePathToComponent(fullPath);
            const title = routeToTitle(routePath);

            pages[routePath] = {
                component,
                title,
                path: routePath,
            };
        }

        const manifest = {
            pages,
            routes: Object.keys(pages),
        };

        // Ensure the pages directory exists (for page discovery)
        await fs.ensureDir(buildConfig.pagesDir);

        // Ensure the routes directory exists (for manifest output)
        await fs.ensureDir(buildConfig.routesDir);

        // Write manifest to file in routes directory
        await fs.writeJson(buildConfig.routesManifestPath, manifest, {
            spaces: 2,
        });

        console.log("✅ Discovered pages:", Object.keys(pages));
        console.log(
            `📁 Routes manifest generated at ${buildConfig.routesManifestPath}`,
        );

        return manifest;
    } catch (error) {
        console.warn("⚠️ Error discovering pages:", error);
        return { pages: {}, routes: [], navigation: [] };
    }
}

export function discoverCommand() {
    console.log("🔍 Discovering pages...");
    discoverPages();
}
