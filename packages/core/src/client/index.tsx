import { createRoot } from "react-dom/client";
import { RSCManager } from "./rsc-manager";

interface PageInfo {
    path: string;
    title: string;
    component: string;
}

declare global {
    interface Window {
        __RSC_PATH__: { pageInfo: PageInfo };
        __rscManager: RSCManager;
        __updateTree: ((stream: ReadableStream) => void) | undefined;
    }
}

async function bootstrap() {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
        throw new Error("Root element not found");
    }

    const root = createRoot(rootElement);
    const rscManager = new RSCManager(root);

    // Expose RSC manager globally for debugging/external use
    window.__rscManager = rscManager;

    // Expose legacy update function for backward compatibility
    window.__updateTree = async (stream: ReadableStream) => {
        await rscManager.updateFromStream(stream);
    };

    // Render initial page
    await rscManager.renderInitialPage();
}

void bootstrap();
