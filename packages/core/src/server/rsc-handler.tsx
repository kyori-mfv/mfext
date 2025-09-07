import express from "express";
import { renderToPipeableStream } from "react-server-dom-webpack/server.node";
import fs from "fs-extra";
import path from "path";
import { getBuildConfig } from "~core/build/build-config.js";
import { Logger } from "./logger";

const buildConfig = getBuildConfig();

/**
 * RSC Handler - Express middleware for React Server Components
 * This handler is compiled by webpack and loaded by the unified server
 */
export async function rscHandler(req: express.Request, res: express.Response) {
    const logger = Logger.getInstance();
    const { path: routePath } = req.query;

    if (!routePath || typeof routePath !== "string") {
        return res.status(400).send("Path parameter is required");
    }

    try {
        const { getAppRoute, loadAllAppComponents } = await import(
            "~core/router"
        );
        const { default: AppRouterMain } = await import("~core/app");

        const appRoute = await getAppRoute(routePath);
        if (!appRoute) {
            return res.status(404).send("App Router page not found");
        }

        const components = await loadAllAppComponents(appRoute);
        const appContent = (
            <AppRouterMain route={appRoute} components={components} />
        );

        res.setHeader("Content-Type", "text/x-component");

        const clientManifest = await fs
            .readJson(
                path.join(
                    buildConfig.publicDir,
                    buildConfig.clientManifestFileName,
                ),
            )
            .catch(() => ({}));

        const { pipe } = renderToPipeableStream(appContent, clientManifest);

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
}
