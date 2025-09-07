import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import ReactServerWebpackPlugin from "react-server-dom-webpack/plugin";
import { getBuildConfig } from "../build-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Shared webpack configuration utilities
 */
export class WebpackConfigBuilder {
    constructor() {
        this.buildConfig = getBuildConfig();
    }

    /**
     * Get common babel loader configuration
     */
    getBabelLoader(includeEnvPreset = true) {
        const presets = [
            "@babel/preset-typescript",
            ["@babel/preset-react", { runtime: "automatic" }],
        ];

        if (includeEnvPreset) {
            presets.unshift("@babel/preset-env");
        }

        return {
            test: /\.(ts|tsx|js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets,
                    plugins: [
                        [
                            "module-resolver",
                            {
                                alias: {
                                    "~core": path.resolve(__dirname, "../.."),
                                },
                            },
                        ],
                    ],
                },
            },
        };
    }

    /**
     * Get common resolve configuration
     */
    getResolveConfig(conditionNames = ["browser"]) {
        return {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            conditionNames,
            modules: conditionNames.includes("node")
                ? [path.resolve(__dirname, "node_modules"), "node_modules"]
                : [
                      path.resolve(
                          this.buildConfig.originalCwd,
                          "node_modules",
                      ),
                      "node_modules",
                  ],
            mainFiles: ["index"],
            alias: {
                "@": path.resolve(this.buildConfig.originalCwd, "src"),
                "~core": path.resolve(__dirname, "../.."),
            },
        };
    }

    /**
     * Get common module rules
     */
    getModuleRules(includeEnvPreset = true) {
        return [this.getBabelLoader(includeEnvPreset)];
    }

    /**
     * Get base configuration
     */
    getBaseConfig(includeEnvPreset = true) {
        return {
            mode: "development",
            module: {
                rules: this.getModuleRules(includeEnvPreset),
            },
            resolve: this.getResolveConfig(),
            resolveLoader: {
                modules: [
                    "node_modules",
                    path.resolve(__dirname, "../../../node_modules"),
                ],
            },
        };
    }

    /**
     * Build client configuration
     */
    buildClientConfig() {
        return {
            ...this.getBaseConfig(),
            entry: path.resolve(__dirname, "../../client/index.tsx"),
            output: {
                path: this.buildConfig.publicDir,
                filename: this.buildConfig.clientBundleFileName,
                chunkFilename: "[name].[chunkhash].js",
                clean: true,
            },
            resolve: this.getResolveConfig(["browser"]),
            plugins: [
                new ReactServerWebpackPlugin({
                    isServer: false,
                    clientReferences: [
                        {
                            directory: path.resolve(
                                this.buildConfig.originalCwd,
                                "src",
                            ),
                            include: /\.(ts|tsx|js|jsx)$/,
                        },
                    ],
                }),
            ],
        };
    }

    /**
     * Build SSR configuration
     */
    buildSSRConfig() {
        return {
            ...this.getBaseConfig(),
            entry: {
                "ssr-server": path.resolve(
                    __dirname,
                    "../../server/ssr-handler.tsx",
                ),
            },
            target: "node",
            output: {
                path: this.buildConfig.ssrDistDir,
                filename: this.buildConfig.ssrHandlerFileName,
                clean: true,
                library: {
                    type: "commonjs2",
                },
                chunkFormat: "commonjs",
            },
            resolve: this.getResolveConfig(["node"]),
            externals: ["commonjs"],
            plugins: [],
        };
    }

    /**
     * Build RSC configuration
     */
    buildRSCConfig() {
        return {
            ...this.getBaseConfig(false), // RSC doesn't need @babel/preset-env
            entry: {
                "rsc-server": path.resolve(
                    __dirname,
                    "../../server/rsc-handler.tsx",
                ),
            },
            target: "node",
            output: {
                path: this.buildConfig.rscDistDir,
                filename: this.buildConfig.rscHandlerFileName,
                clean: true,
                library: {
                    type: "commonjs2",
                },
                chunkFormat: "commonjs",
            },
            resolve: this.getResolveConfig(["react-server", "node"]),
            externals: [
                "express",
                "commonjs",
                this.createClientComponentExternal(),
            ],
        };
    }

    /**
     * Create client component external resolver for RSC
     */
    createClientComponentExternal() {
        return function ({ request, context }, callback) {
            // Skip non-relative imports
            if (!request || !request.startsWith(".")) {
                return callback();
            }

            // Convert relative path to absolute
            let absolutePath = path.resolve(
                context || this.buildConfig.originalCwd,
                request,
            );

            // Handle file extension resolution
            const extensions = [".tsx", ".ts", ".jsx", ".js"];
            if (!fs.existsSync(absolutePath)) {
                for (const ext of extensions) {
                    const pathWithExt = absolutePath + ext;
                    if (fs.existsSync(pathWithExt)) {
                        absolutePath = pathWithExt;
                        break;
                    }
                }
            }

            // Check for client components
            if (fs.existsSync(absolutePath)) {
                try {
                    const fileContent = fs.readFileSync(absolutePath, "utf8");
                    const trimmedContent = fileContent.trim();

                    if (
                        trimmedContent.startsWith('"use client"') ||
                        trimmedContent.startsWith("'use client'")
                    ) {
                        console.log(
                            `🚫 Excluding client component from RSC build: ${absolutePath}`,
                        );
                        return callback(null, `commonjs ${absolutePath}`);
                    }
                } catch {
                    // Silently handle file read errors
                }
            }

            callback();
        }.bind(this);
    }
}

export const createClientConfig = () => {
    const builder = new WebpackConfigBuilder();
    return builder.buildClientConfig();
};

export const createSSRConfig = () => {
    const builder = new WebpackConfigBuilder();
    return builder.buildSSRConfig();
};

export const createRSCConfig = () => {
    const builder = new WebpackConfigBuilder();
    return builder.buildRSCConfig();
};
