import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getBuildConfig() {
    const originalCwd = process.env.originalCwd || process.cwd();

    return {
        // Directories
        appDir: path.join(originalCwd, "src", "app"),
        routesDir: path.join(originalCwd, "dist"),
        publicDir: path.join(originalCwd, "dist", "public"),
        rscDistDir: path.join(originalCwd, "dist", "rsc"),
        ssrDistDir: path.join(originalCwd, "dist", "ssr"),

        clientBundleFileName: "client.js",
        rscHandlerFileName: "rsc-handler.cjs",
        ssrHandlerFileName: "ssr-handler.cjs",
        serverStarterFileName: "server-starter.cjs",
        clientManifestFileName: "react-client-manifest.json",

        endpoints: {
            rsc: "/rsc",
            static: "/static",
        },

        appRoutesManifestPath: path.join(
            originalCwd,
            "dist",
            "app-routes-manifest.json",
        ),

        webpackConfigs: {
            ssr: path.resolve(__dirname, "webpack", "ssr.config.js"),
            rsc: path.resolve(__dirname, "webpack", "rsc.config.js"),
            client: path.resolve(__dirname, "webpack", "client.config.js"),
        },

        serverPath: path.resolve(__dirname, "../server/index.js"),

        originalCwd,
    };
}
