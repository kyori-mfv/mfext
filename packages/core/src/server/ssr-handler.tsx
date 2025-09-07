import express from "express";
import { renderToString } from "react-dom/server";
import { Logger } from "./logger";
import { getBuildConfig } from "~core/build/build-config.js";

const buildConfig = getBuildConfig();

/**
 * SSR Handler - Express middleware for server-side rendering
 * This handler is compiled by webpack and loaded by the unified server
 */
export async function ssrHandler(req: express.Request, res: express.Response) {
    const logger = Logger.getInstance();

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
                    <script src="${buildConfig.endpoints.static}/${buildConfig.clientBundleFileName}" type="module"></script>
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
}
