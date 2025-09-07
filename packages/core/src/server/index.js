import express from "express";
import path from "path";
import { getBuildConfig } from "../build/build-config.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
require("react-server-dom-webpack/node-register")();

export function createUnifiedServer(options = {}) {
    const { port = 5000 } = options;
    const buildConfig = getBuildConfig();

    const app = express();
    let server = null;

    // Import the handlers from the webpack builds
    const rscServerPath = path.join(
        buildConfig.rscDistDir,
        buildConfig.rscHandlerFileName,
    );
    const ssrServerPath = path.join(
        buildConfig.ssrDistDir,
        buildConfig.ssrHandlerFileName,
    );

    let rscModule;
    let ssrModule;

    try {
        rscModule = require(rscServerPath);
        ssrModule = require(ssrServerPath);
    } catch (error) {
        throw new Error(
            `Failed to load server modules. Please ensure build has completed successfully. Error: ${error.message}`,
        );
    }

    // Static assets (client bundle)
    app.use(
        buildConfig.endpoints.static,
        express.static(buildConfig.publicDir),
    );

    // Mount RSC build under /rsc - using the existing rscHandler
    app.get(buildConfig.endpoints.rsc, rscModule.rscHandler);

    // Mount SSR build under everything else - using the existing ssrHandler
    app.get("*", ssrModule.ssrHandler);

    return {
        start: () => {
            return new Promise((resolve, reject) => {
                if (server) {
                    return reject(new Error("Server is already running"));
                }

                server = app.listen(port, () => {
                    console.log(
                        `🚀 Unified server running at http://localhost:${port}`,
                    );
                    console.log(
                        `📊 RSC endpoint: http://localhost:${port}/rsc?path=/`,
                    );
                    console.log(`📄 SSR endpoint: http://localhost:${port}/`);

                    resolve();
                });

                server.on("error", (error) => {
                    if (error.code === "EADDRINUSE") {
                        console.error(
                            `Unified Server port conflict:`,
                            error.message,
                        );
                        reject(new Error(`Port ${port} is already in use`));
                    } else {
                        console.error(
                            `Unified Server startup error:`,
                            error.message,
                        );
                        reject(error);
                    }
                });
            });
        },
        stop: () => {
            return new Promise((resolve, reject) => {
                if (!server) {
                    return resolve();
                }

                server.close((error) => {
                    if (error) {
                        console.error(
                            "Error stopping RSC Server",
                            { port: port },
                            error,
                        );
                        reject(error);
                    } else {
                        server = null;
                        console.info("RSC Server stopped", { port: port });
                        resolve();
                    }
                });
            });
        },
        getPort: () => port,
    };
}
