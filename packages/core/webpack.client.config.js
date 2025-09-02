import path from "path";
import { fileURLToPath } from "url";
import ReactServerWebpackPlugin from "react-server-dom-webpack/plugin";
import { getBuildConfig } from "./build-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default () => {
    const buildConfig = getBuildConfig();

    return {
        mode: "development",
        entry: path.resolve(__dirname, "./src/client.tsx"),
        output: {
            path: buildConfig.publicDir,
            filename: "client.js",
            chunkFilename: "[name].[chunkhash].js",
            clean: true,
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
        plugins: [
            new ReactServerWebpackPlugin({
                isServer: false,
                clientReferences: [
                    // Point to the app’s components, not build-tool’s
                    {
                        directory: path.resolve(buildConfig.originalCwd, "src"),
                        include: /\.(ts|tsx|js|jsx)$/,
                    },
                ],
            }),
        ],
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            conditionNames: ["browser"],
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@/types": path.resolve(__dirname, "src/types"),
                "@/tools": path.resolve(__dirname, "src/tools"),
            },
        },
    };
};
