import express from "express";
import { renderToPipeableStream } from "react-server-dom-webpack/server.node";
import MainApp from "~core/index";
import {
    getPageComponent,
    loadRoutesManifest,
} from "~core/tools/manifest-router";
import fs from "fs-extra";
import path from "path";

const app = express();
const PORT = 5001;

app.use("/static", express.static("public"));

// RSC API endpoint
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
        console.log(
            "RSC Server - pageComponent",
            pageComponent,
            req.path,
            req.query,
        );

        res.setHeader("Content-Type", "text/x-component");

        const clientManifest = await fs
            .readJson(
                path.join(process.cwd(), "public/react-client-manifest.json"),
            )
            .catch(() => ({}));
        const { pipe } = renderToPipeableStream(
            <MainApp pageComponent={pageComponent} />,
            clientManifest,
        );

        pipe(res);
    } catch (error) {
        console.error("RSC Server error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Health check endpoint
app.get("/health", (_req, res) => {
    res.json({ status: "ok", server: "RSC API", port: PORT });
});

app.listen(PORT, () => {
    console.log(`🚀 RSC API Server running on http://localhost:${PORT}`);
});
