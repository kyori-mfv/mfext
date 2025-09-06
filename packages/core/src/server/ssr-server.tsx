import express from "express";
import { renderToString } from "react-dom/server";
import { getBuildConfig } from "../build/build-config.js";
import { Server } from "http";
import { Logger } from "./logger";

export interface SSRServerOptions {
    port?: number;
    rscServerUrl?: string;
}

export interface SSRServerInstance {
    app: express.Application;
    start: () => Promise<Server>;
    stop: () => Promise<void>;
    getPort: () => number;
}

export function createSSRServer(
    options: SSRServerOptions = {},
): SSRServerInstance {
    const PORT = options.port || 5000;
    const RSC_SERVER_URL = options.rscServerUrl || "http://localhost:5001";
    const buildConfig = getBuildConfig();
    const app = express();
    let server: Server | null = null;
    const logger = Logger.getInstance();
    const performanceMonitor = logger.createPerformanceMonitor("SSR");

    // Request logging middleware
    app.use(logger.createRequestLogger("SSR"));

    // Error handling middleware
    app.use(
        (
            err: Error,
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
        ) => {
            logger.error(
                "SSR Server Error",
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

    app.use("/static", express.static(buildConfig.publicDir));

    app.use("/rsc", (req, res) => {
        fetch(`${RSC_SERVER_URL}${req.originalUrl}`)
            .then((response) => {
                res.status(response.status);
                response.headers.forEach((value, key) => {
                    res.setHeader(key, value);
                });
                return response.body;
            })
            .then((body) => {
                if (body) {
                    body.pipeTo(
                        new WritableStream({
                            write(chunk) {
                                res.write(chunk);
                            },
                            close() {
                                res.end();
                            },
                        }),
                    );
                } else {
                    res.end();
                }
            })
            .catch((error) => {
                logger.error(
                    "RSC proxy error",
                    {
                        rscServerUrl: RSC_SERVER_URL,
                        originalUrl: req.originalUrl,
                    },
                    error,
                );
                res.status(500).send("RSC server unavailable");
            });
    });

    // Health check endpoint
    app.get("/health", (_req, res) => {
        const memoryUsage = process.memoryUsage();
        const uptime = process.uptime();

        const healthStatus = {
            status: "ok",
            server: "SSR",
            port: PORT,
            uptime: `${Math.floor(uptime)}s`,
            memory: {
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
            },
            rscServerUrl: RSC_SERVER_URL,
            timestamp: new Date().toISOString(),
        };

        res.json(healthStatus);
    });

    app.get("*", async (req, res) => {
        try {
            const { getAppRoute, loadAllAppComponents } = await import(
                "~core/router"
            );
            const { default: AppRouterMain } = await import("~core/app");

            const appRoute = await getAppRoute(req.path);
            if (!appRoute) {
                logger.warn("App Router page not found", { path: req.path });
                return res.status(404).send(`
                    <!DOCTYPE html>
                    <html>
                        <head><title>404 - Page Not Found</title></head>
                        <body>
                            <h1>404 - Page Not Found</h1>
                            <p>The page "${req.path}" does not exist.</p>
                            <a href="/">Go Home</a>
                        </body>
                    </html>
                `);
            }

            const components = await loadAllAppComponents(appRoute);
            const AppContent = (
                <AppRouterMain route={appRoute} components={components} />
            );
            const appHTML = renderToString(AppContent);
            const title = `MFExt App Router - ${req.path}`;

            const html = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>${title}</title>
                    </head>
                    <body>
                        <div id="root">${appHTML}</div>
                        <script>window.__RSC_PATH__ = ${JSON.stringify({
                            pageInfo: {
                                path: req.path,
                                title: title,
                                component: "app-router",
                            },
                        })};</script>
                        <script src="/static/client.js" type="module"></script>
                    </body>
                </html>
            `;

            res.setHeader("Content-Type", "text/html").send(html);
        } catch (error) {
            logger.error(
                "SSR rendering error",
                {
                    path: req.path,
                    method: req.method,
                },
                error as Error,
            );

            res.status(500).send(`
                <!DOCTYPE html>
                <html>
                    <head><title>500 - Internal Server Error</title></head>
                    <body>
                        <h1>500 - Internal Server Error</h1>
                        <p>An error occurred while rendering the page.</p>
                        <a href="/">Go Home</a>
                    </body>
                </html>
            `);
        }
    });

    const start = (): Promise<Server> => {
        return new Promise((resolve, reject) => {
            if (server) {
                return reject(new Error("Server is already running"));
            }

            server = app.listen(PORT, () => {
                logger.info(`SSR Server started`, {
                    port: PORT,
                    url: `http://localhost:${PORT}`,
                });
                console.log(`✅ Server running on http://localhost:${PORT}`);

                // Start performance monitoring
                performanceMonitor.startInterval();

                resolve(server!);
            });

            server.on("error", (error: NodeJS.ErrnoException) => {
                if (error.code === "EADDRINUSE") {
                    logger.error(
                        `SSR Server port conflict`,
                        { port: PORT },
                        error,
                    );
                    reject(new Error(`Port ${PORT} is already in use`));
                } else {
                    logger.error(
                        `SSR Server startup error`,
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
                        "Error stopping SSR Server",
                        { port: PORT },
                        error,
                    );
                    reject(error);
                } else {
                    server = null;
                    logger.info("SSR Server stopped", { port: PORT });
                    console.log("SSR Server stopped");
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
