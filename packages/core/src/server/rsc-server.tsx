import express from "express";
import { renderToPipeableStream } from "react-server-dom-webpack/server.node";
import MainApp from "~core/app";
import { getPageComponent, loadRoutesManifest } from "~core/router";
import fs from "fs-extra";
import path from "path";
import { Server } from "http";
import { Logger } from "./logger";

export interface RSCServerOptions {
    port?: number;
    publicDir?: string;
}

export interface RSCServerInstance {
    app: express.Application;
    start: () => Promise<Server>;
    stop: () => Promise<void>;
    getPort: () => number;
}

export function createRSCServer(
    options: RSCServerOptions = {},
): RSCServerInstance {
    const PORT = options.port || 5001;
    const PUBLIC_DIR = options.publicDir || "public";
    const app = express();
    let server: Server | null = null;
    const logger = Logger.getInstance();
    const performanceMonitor = logger.createPerformanceMonitor("RSC");

    // Request logging middleware
    app.use(logger.createRequestLogger("RSC"));

    // Error handling middleware
    app.use(
        (
            err: Error,
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
        ) => {
            logger.error(
                "RSC Server Error",
                {
                    method: req.method,
                    url: req.url,
                    statusCode: res.statusCode,
                },
                err,
            );

            if (!res.headersSent) {
                res.status(500).send("Internal Server Error");
            }
            next();
        },
    );

    app.use("/static", express.static(PUBLIC_DIR));

    app.use("/rsc", async (req, res) => {
        const { path: routePath } = req.query;
        if (!routePath || typeof routePath !== "string") {
            return res.status(400).send("Path parameter is required");
        }

        try {
            const routesManifest = await loadRoutesManifest();
            const { default: pageComponent } = await getPageComponent(
                routePath,
                routesManifest,
            );

            res.setHeader("Content-Type", "text/x-component");

            const clientManifest = await fs
                .readJson(
                    path.join(
                        process.cwd(),
                        "public/react-client-manifest.json",
                    ),
                )
                .catch(() => ({}));
            const { pipe } = renderToPipeableStream(
                <MainApp pageComponent={pageComponent} />,
                clientManifest,
            );

            pipe(res);
        } catch (error) {
            logger.error(
                "RSC component rendering error",
                {
                    routePath,
                    method: req.method,
                },
                error as Error,
            );
            res.status(500).send("Internal Server Error");
        }
    });

    app.get("/health", (_req, res) => {
        const memoryUsage = process.memoryUsage();
        const uptime = process.uptime();

        const healthStatus = {
            status: "ok",
            server: "RSC API",
            port: PORT,
            uptime: `${Math.floor(uptime)}s`,
            memory: {
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
            },
            timestamp: new Date().toISOString(),
        };

        res.json(healthStatus);
    });

    const start = (): Promise<Server> => {
        return new Promise((resolve, reject) => {
            if (server) {
                return reject(new Error("Server is already running"));
            }

            server = app.listen(PORT, () => {
                logger.info(`RSC API Server started`, {
                    port: PORT,
                    url: `http://localhost:${PORT}`,
                });
                console.log(
                    `🚀 RSC API Server running on http://localhost:${PORT}`,
                );

                // Start performance monitoring
                performanceMonitor.startInterval();

                resolve(server!);
            });

            server.on("error", (error: NodeJS.ErrnoException) => {
                if (error.code === "EADDRINUSE") {
                    logger.error(
                        `RSC Server port conflict`,
                        { port: PORT },
                        error,
                    );
                    reject(new Error(`Port ${PORT} is already in use`));
                } else {
                    logger.error(
                        `RSC Server startup error`,
                        { port: PORT },
                        error,
                    );
                    reject(error);
                }
            });
        });
    };

    const stop = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!server) {
                return resolve();
            }

            server.close((error) => {
                if (error) {
                    logger.error(
                        "Error stopping RSC Server",
                        { port: PORT },
                        error,
                    );
                    reject(error);
                } else {
                    server = null;
                    logger.info("RSC Server stopped", { port: PORT });
                    console.log("RSC Server stopped");
                    resolve();
                }
            });
        });
    };

    const getPort = (): number => PORT;

    return {
        app,
        start,
        stop,
        getPort,
    };
}
