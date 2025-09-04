import path from "path";
import { fileURLToPath } from "url";
import { getBuildConfig } from "./build-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default () => {
    const buildConfig = getBuildConfig();

    return {
        mode: "development",
        experiments: {
            outputModule: true,
        },
        entry: {
            "ssr-server": path.resolve(__dirname, "ssr-server.tsx"),
        },
        target: "node",
        output: {
            path: buildConfig.ssrDistDir,
            filename: "ssr-server.js",
            clean: true,
            library: {
                type: "module",
            },
            chunkFormat: "module",
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
                                "@babel/preset-env",
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
                                            "~core": "./src",
                                            "~core/types": "./src/types",
                                            "~core/tools": "./src/tools",
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
            conditionNames: ["node"],
            modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
            alias: {
                "@": path.resolve(buildConfig.originalCwd, "src"),
                "~core/types": path.resolve(__dirname, "src/types"),
                "~core/tools": path.resolve(__dirname, "src/tools"),
            },
        },
        externals: [],
        plugins: [],
    };
};
