import { createFromReadableStream } from "react-server-dom-webpack/client";
import type { Root } from "react-dom/client";
import React from "react";
import { NavigationProvider, NAVIGATION_EVENT } from "@mfext/navigation";

interface PageInfo {
    path: string;
    title: string;
    component: string;
}

declare global {
    interface Window {
        __RSC_PATH__: { pageInfo: PageInfo };
    }
}

export interface RSCNavigationEvent {
    type: "navigate";
    url: string;
    method: "push" | "replace" | "popstate";
}

export class RSCManager {
    private root: Root;
    private isNavigating = false;

    constructor(root: Root) {
        this.root = root;
        this.setupNavigationListener();
    }

    /**
     * Wrap RSC content with NavigationProvider
     */
    private wrapWithNavigation(rsc: React.ReactNode) {
        return React.createElement(NavigationProvider, { children: rsc });
    }

    /**
     * Fetch RSC data from server and create React elements
     */
    async fetchRSC(path: string): Promise<React.ReactNode> {
        const response = await fetch(`/rsc?path=${encodeURIComponent(path)}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch RSC data: ${response.status}`);
        }

        const { body } = response;
        if (!body) {
            throw new Error("Response body is null");
        }

        return createFromReadableStream(body);
    }

    /**
     * Create RSC elements from string data (for navigation)
     */
    async createRSCFromString(rscData: string): Promise<React.ReactNode> {
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode(rscData));
                controller.close();
            },
        });

        return createFromReadableStream(stream);
    }

    /**
     * Navigate to a new route with RSC rendering
     */
    async navigateToRoute(
        url: string,
        method: "push" | "replace" = "push",
    ): Promise<void> {
        if (this.isNavigating) {
            console.warn("Navigation already in progress");
            return;
        }

        this.isNavigating = true;

        try {
            // Fetch RSC data
            const rsc = await this.fetchRSC(url);

            // Update browser history
            if (method === "push") {
                window.history.pushState(null, "", url);
            } else if (method === "replace") {
                window.history.replaceState(null, "", url);
            }

            // Update page info
            this.updatePageInfo(url);

            // Render new content
            this.root.render(this.wrapWithNavigation(rsc));

            console.log(`Navigation complete: ${method} to ${url}`);
        } catch (error) {
            console.error("Navigation failed:", error);
            // Fallback to full page navigation
            if (method === "replace") {
                window.location.replace(url);
            } else {
                window.location.href = url;
            }
        } finally {
            this.isNavigating = false;
        }
    }

    /**
     * Handle browser back/forward navigation
     */
    async handlePopStateNavigation(url: string): Promise<void> {
        if (this.isNavigating) {
            return;
        }

        this.isNavigating = true;

        try {
            // Fetch RSC data for current URL
            const rsc = await this.fetchRSC(url);

            // Update page info
            this.updatePageInfo(url);

            // Render new content
            this.root.render(this.wrapWithNavigation(rsc));

            console.log(`Popstate navigation complete to ${url}`);
        } catch (error) {
            console.error("Popstate navigation failed:", error);
            // Fallback to page reload
            window.location.reload();
        } finally {
            this.isNavigating = false;
        }
    }

    /**
     * Render initial page content
     */
    async renderInitialPage(): Promise<void> {
        const { pageInfo } = window.__RSC_PATH__;
        const rsc = await this.fetchRSC(pageInfo.path);
        this.root.render(this.wrapWithNavigation(rsc));
    }

    /**
     * Update page metadata
     */
    private updatePageInfo(url: string): void {
        const title = `MFExt App Router - ${url}`;

        // Update global page info
        window.__RSC_PATH__ = {
            pageInfo: {
                path: url,
                title,
                component: "app-router",
            },
        };

        // Update document title
        document.title = title;
    }

    /**
     * Setup navigation event listeners
     */
    private setupNavigationListener(): void {
        // Listen for navigation events from NavigationContext
        window.addEventListener(NAVIGATION_EVENT, async (event: Event) => {
            const customEvent = event as CustomEvent<RSCNavigationEvent>;
            const { url, method } = customEvent.detail;

            if (method === "popstate") {
                await this.handlePopStateNavigation(url);
            } else {
                await this.navigateToRoute(url, method);
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener("popstate", async () => {
            const url = window.location.pathname + window.location.search;
            await this.handlePopStateNavigation(url);
        });
    }

    /**
     * Get current navigation state
     */
    get navigationState() {
        return {
            isNavigating: this.isNavigating,
            currentPath: window.__RSC_PATH__?.pageInfo?.path || "/",
        };
    }

    /**
     * Expose update function for external use
     */
    async updateFromStream(stream: ReadableStream): Promise<void> {
        const rsc = await createFromReadableStream(stream);
        this.root.render(rsc);
    }
}
