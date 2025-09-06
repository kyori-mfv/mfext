import { glob } from "glob";
import path from "path";
import fs from "fs-extra";
import { getBuildConfig } from "../../src/build/build-config.js";

// App Router: Convert directory path to route path
function appPathToRoute(dirPath) {
    if (!dirPath || dirPath === ".") return "/";
    return `/${dirPath}`;
}

// App Router: Discover app router files
async function discoverAppRouter() {
    const buildConfig = getBuildConfig();

    try {
        // Check if app directory exists
        if (!(await fs.pathExists(buildConfig.appDir))) {
            console.log(
                "ℹ️ No app/ directory found, skipping App Router discovery",
            );
            return null;
        }

        const appFiles = await glob(
            `**/+(page|layout|loading|error|not-found).{tsx,jsx}`,
            {
                cwd: buildConfig.appDir,
            },
        );

        const segments = {};

        // Group files by directory
        for (const filePath of appFiles) {
            const dirPath = path.dirname(filePath);
            const fileName = path.basename(filePath);
            const fileType = fileName.replace(/\.(tsx|jsx)$/, "");

            if (!segments[dirPath]) {
                segments[dirPath] = {
                    path: appPathToRoute(dirPath),
                    children: {},
                };
            }

            segments[dirPath][fileType] = filePath;
        }

        const tree = buildAppRouteTree(segments);
        const routes = generateAppRoutes(tree);

        const manifest = {
            routes,
            tree,
        };

        await fs.ensureDir(buildConfig.routesDir);
        await fs.writeJson(buildConfig.appRoutesManifestPath, manifest, {
            spaces: 2,
        });

        console.log("✅ Discovered App Router files:", appFiles);
        console.log(
            `📁 App Routes manifest generated at ${buildConfig.appRoutesManifestPath}`,
        );

        return manifest;
    } catch (error) {
        console.warn("⚠️ Error discovering App Router:", error);
        return null;
    }
}

// Build route tree structure
function buildAppRouteTree(segments) {
    const root = {
        path: "/",
        children: {},
    };

    // Sort segments by depth (shallow first)
    const sortedSegments = Object.entries(segments).sort(([a], [b]) => {
        const depthA = a === "." ? 0 : a.split("/").length;
        const depthB = b === "." ? 0 : b.split("/").length;
        return depthA - depthB;
    });

    for (const [dirPath, segment] of sortedSegments) {
        if (dirPath === ".") {
            // Root level
            Object.assign(root, segment);
        } else {
            // Nested segments
            const parts = dirPath.split("/");
            let current = root;

            for (const part of parts) {
                if (!current.children[part]) {
                    current.children[part] = {
                        path: `${current.path === "/" ? "" : current.path}/${part}`,
                        children: {},
                    };
                }
                current = current.children[part];
            }

            // Merge segment data
            Object.assign(current, segment);
        }
    }

    return root;
}

// Generate routes object from tree structure
function generateAppRoutes(tree) {
    const routes = {};

    function collectRoutes(segment, currentPath = "") {
        const path = currentPath || segment.path;

        // If this segment has a page, create a route entry
        if (segment.page) {
            const layouts = [];

            // Walk up the tree to collect layouts
            const pathSegments =
                path === "/" ? [] : path.split("/").filter((s) => s);
            let currentSegment = tree;

            // Add root layout if exists
            if (currentSegment.layout) {
                layouts.push(currentSegment.layout);
            }

            // Walk through path segments to collect layouts
            for (const pathSegment of pathSegments) {
                if (currentSegment.children[pathSegment]) {
                    currentSegment = currentSegment.children[pathSegment];
                    if (currentSegment.layout) {
                        layouts.push(currentSegment.layout);
                    }
                }
            }

            routes[path] = {
                path,
                segments: pathSegments,
                page: segment.page,
                layouts,
            };
        }

        // Recursively process children
        for (const [childKey, childSegment] of Object.entries(
            segment.children,
        )) {
            const childPath =
                path === "/" ? `/${childKey}` : `${path}/${childKey}`;
            collectRoutes(childSegment, childPath);
        }
    }

    collectRoutes(tree);
    return routes;
}

export async function discoverCommand() {
    console.log("🔍 Discovering App Router routes...");

    // Only discover App Router
    const appManifest = await discoverAppRouter();

    console.log("🎉 App Router discovery complete!");

    return {
        app: appManifest,
    };
}
