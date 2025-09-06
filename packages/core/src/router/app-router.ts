import type { AppRouteSegment, AppRoute, AppRoutesManifest } from "~core/types";

export class AppRouter {
    private manifest: AppRoutesManifest | null = null;

    constructor(manifest?: AppRoutesManifest) {
        this.manifest = manifest || null;
    }

    /**
     * Set the routes manifest
     */
    setManifest(manifest: AppRoutesManifest) {
        this.manifest = manifest;
    }

    /**
     * Resolve a route path to its complete route information
     */
    resolveRoute(pathname: string): AppRoute | null {
        if (!this.manifest) return null;

        const route = this.buildRouteFromPath(pathname);
        return route;
    }

    /**
     * Build route information from a pathname
     */
    private buildRouteFromPath(pathname: string): AppRoute | null {
        if (!this.manifest) return null;

        const segments = this.pathToSegments(pathname);
        const layoutChain = this.resolveLayoutChain(segments);
        const pageComponent = this.resolvePageComponent(segments);

        if (!pageComponent) return null;

        return {
            path: pathname,
            segments,
            page: pageComponent,
            layouts: layoutChain,
        };
    }

    /**
     * Convert pathname to route segments
     */
    private pathToSegments(pathname: string): string[] {
        if (pathname === "/") return [];
        return pathname.split("/").filter((segment) => segment.length > 0);
    }

    /**
     * Resolve the layout chain for a given route segments
     */
    private resolveLayoutChain(segments: string[]): string[] {
        if (!this.manifest) return [];

        const layouts: string[] = [];
        let current = this.manifest.tree;

        // Always include root layout if it exists
        if (current.layout) {
            layouts.push(current.layout);
        }

        // Walk through segments to collect layouts
        for (const segment of segments) {
            if (current.children[segment]) {
                current = current.children[segment];
                if (current.layout) {
                    layouts.push(current.layout);
                }
            } else {
                break;
            }
        }

        return layouts;
    }

    /**
     * Find the page component for given segments
     */
    private resolvePageComponent(segments: string[]): string | null {
        if (!this.manifest) return null;

        let current = this.manifest.tree;

        // Navigate to the target segment
        for (const segment of segments) {
            if (current.children[segment]) {
                current = current.children[segment];
            } else {
                return null;
            }
        }

        return current.page || null;
    }

    /**
     * Get all available routes
     */
    getAvailableRoutes(): string[] {
        if (!this.manifest) return [];

        const routes: string[] = [];
        this.collectRoutes(this.manifest.tree, routes);
        return routes;
    }

    /**
     * Recursively collect all routes from the tree
     */
    private collectRoutes(
        segment: AppRouteSegment,
        routes: string[],
        currentPath = "",
    ): void {
        const path = currentPath || segment.path;

        // If this segment has a page, it's a valid route
        if (segment.page) {
            routes.push(path);
        }

        // Recursively collect from children
        for (const [childKey, childSegment] of Object.entries(
            segment.children,
        )) {
            const childPath =
                path === "/" ? `/${childKey}` : `${path}/${childKey}`;
            this.collectRoutes(childSegment, routes, childPath);
        }
    }
}
