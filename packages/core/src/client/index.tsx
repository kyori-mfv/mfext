import { createRoot } from "react-dom/client";
import { createFromReadableStream } from "react-server-dom-webpack/client";

interface PageInfo {
    path: string;
    title: string;
    component: string;
}

declare global {
    interface Window {
        __RSC_PATH__: { pageInfo: PageInfo };
        __updateTree: ((stream: ReadableStream) => void) | undefined;
    }
}

async function fetchRSC() {
    const { pageInfo } = window.__RSC_PATH__;
    const response = await fetch(`/rsc?path=${pageInfo.path}`);
    const { body } = response;
    if (!body) {
        throw new Error("Response body is null");
    }

    return createFromReadableStream(body);
}

async function bootstrap() {
    const rsc = await fetchRSC();
    const rootElement = document.getElementById("root");
    if (!rootElement) {
        throw new Error("Root element not found");
    }

    const root = createRoot(rootElement);
    root.render(rsc);
}

void bootstrap();
