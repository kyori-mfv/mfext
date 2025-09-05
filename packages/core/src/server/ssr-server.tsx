import express from "express";
import { renderToString } from "react-dom/server";
import { getPageComponent, loadRoutesManifest } from "~core/router";
import MainApp from "~core/index";
import { getBuildConfig } from "../build/build-config.js";

const app = express();
const PORT = 5000;
const buildConfig = getBuildConfig();

app.use("/static", express.static(buildConfig.publicDir));

app.use("/rsc", (req, res) => {
    fetch(`http://localhost:5001${req.originalUrl}`)
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
            console.error("RSC proxy error:", error);
            res.status(500).send("RSC server unavailable");
        });
});

// Universal route handler - serve static HTML shell
app.get("*", async (req, res) => {
    const routesManifest = await loadRoutesManifest();
    const pageInfo = routesManifest.pages[req.path];

    if (!pageInfo) {
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

    const title = `React RSC Demo - ${pageInfo.title}`;
    const { default: pageComponent } = await getPageComponent(
        req.path,
        routesManifest,
    );
    const appHTML = renderToString(<MainApp pageComponent={pageComponent} />);

    const html = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>${title}</title>
            </head>
            <body>
                <div id="root">${appHTML}</div>
                <script>window.__RSC_PATH__ = ${JSON.stringify({ pageInfo })};</script>
                <script src="/static/client.js" type="module"></script>
            </body>
        </html>
    `;

    res.setHeader("Content-Type", "text/html").send(html);
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
