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
        publicDir: path.join(originalCwd, "public"),
        rscDistDir: path.join(originalCwd, "dist", "rsc"),
        ssrDistDir: path.join(originalCwd, "dist", "ssr"),

        // Files
        appRoutesManifestPath: path.join(
            originalCwd,
            "dist",
            "app-routes-manifest.json",
        ),

        // Build tool configs
        webpackConfigs: {
            ssr: path.resolve(__dirname, "webpack", "ssr.config.js"),
            rsc: path.resolve(__dirname, "webpack", "rsc.config.js"),
            client: path.resolve(__dirname, "webpack", "client.config.js"),
        },

        ports: {
            ssr: 5000,
            rsc: 5001,
        },

        originalCwd,
    };
}
