import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { getBuildConfig } from "./build-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default () => {
    const buildConfig = getBuildConfig();

    return {
        mode: "development",
        entry: {
            "rsc-server": path.resolve(__dirname, "rsc-server.tsx"),
        },
        target: "node",
        output: {
            path: buildConfig.rscDistDir,
            filename: "rsc-server.cjs",
            clean: true,
            library: {
                type: "commonjs2",
            },
            chunkFormat: "commonjs",
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx|js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-typescript",
                                [
                                    "@babel/preset-react",
                                    { runtime: "automatic" },
                                ],
                            ],
                            plugins: [
                                [
                                    "module-resolver",
                                    {
                                        root: ["./src"],
                                        alias: {
                                            "@": "./src",
                                            "@/types": "./src/types",
                                            "@/tools": "./src/tools",
                                        },
                                    },
                                ],
                            ],
                        },
                    },
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            conditionNames: ["react-server", "node"],
            modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
            alias: {
                "@": path.resolve(buildConfig.originalCwd, "src"),
                "@/types": path.resolve(__dirname, "src/types"),
                "@/tools": path.resolve(__dirname, "src/tools"),
            },
        },
        // plugins: [new ExcludeClientComponentsPlugin()],
        externals: [createClientComponentExternal(buildConfig.originalCwd)],
    };
};

function createClientComponentExternal(originalCwd) {
    /**
     * Webpack external resolver function that processes module requests
     *
     * @param {Object} params - The webpack external function parameters
     * @param {string} params.request - The module request path (e.g., "./Button", "../components/Modal")
     * @param {string} params.context - The directory context from which the request is made
     * @param {Function} callback - Webpack callback function to signal resolution result
     * @param {Error|null} callback.error - Error object if resolution failed, null if successful
     * @param {string} [callback.result] - External module definition (e.g., "commonjs ./path/to/module")
     */
    return function ({ request, context }, callback) {
        // Skip non-relative imports (e.g., "react", "lodash", etc.)
        // Only process relative imports that start with "." (e.g., "./Button", "../Modal")
        if (!request || !request.startsWith(".")) {
            return callback();
        }

        // Convert the relative request path to an absolute filesystem path
        // Use the provided context directory, falling back to originalCwd
        let absolutePath = path.resolve(context || originalCwd, request);

        // Handle file extension resolution for JavaScript/TypeScript files
        // Try to find the file with common React/TypeScript extensions if no extension provided
        const extensions = [".tsx", ".ts", ".jsx", ".js"];
        if (!fs.existsSync(absolutePath)) {
            // Iterate through extensions to find a matching file
            for (const ext of extensions) {
                const pathWithExt = absolutePath + ext;
                if (fs.existsSync(pathWithExt)) {
                    absolutePath = pathWithExt;
                    break;
                }
            }
        }

        // Read and analyze the file content to detect client components
        if (fs.existsSync(absolutePath)) {
            try {
                // Read the entire file content as UTF-8 text
                const fileContent = fs.readFileSync(absolutePath, "utf8");
                const trimmedContent = fileContent.trim();

                // Check for React "use client" directive at the beginning of the file
                // This directive indicates the component should run on the client side
                if (
                    trimmedContent.startsWith('"use client"') ||
                    trimmedContent.startsWith("'use client'")
                ) {
                    console.log(
                        `🚫 Excluding client component from RSC build: ${absolutePath}`,
                    );

                    // Mark as external CommonJS module to exclude from server bundle
                    // The absolute path ensures proper module resolution at runtime
                    return callback(null, `commonjs ${absolutePath}`);
                }
            } catch {
                // Silently handle file read errors and continue with normal resolution
                // This prevents build failures due to temporary file access issues
            }
        }

        // Allow webpack to handle the module normally (bundle it with server code)
        // Called when file doesn't exist, isn't a client component, or had read errors
        callback();
    };
}
