import { RoutesManifest, PageInfo } from "@/types";
import * as fs from "fs-extra";
import { getBuildConfig } from "../../build-config.js";

export async function loadRoutesManifest(): Promise<RoutesManifest> {
    const buildConfig = getBuildConfig();
    const manifestPath = buildConfig.routesManifestPath;
    console.log("Manifest path:", manifestPath);
    const manifest: RoutesManifest = await fs
        .readJson(manifestPath)
        .catch(() => ({ pages: {}, routes: [] }));

    return manifest;
}

export function getPageComponent(
    routePath: string,
    routesManifest: RoutesManifest,
): Promise<{ default: React.ComponentType }> {
    const page = routesManifest.pages[routePath];

    if (!page) {
        throw new Error(`Page not found: ${routePath}`);
    }

    console.log("Loading page:", page);
    return import(`@/pages/${page.component}`);
}

export function getAllRoutes(routesManifest: RoutesManifest): string[] {
    return routesManifest.routes;
}

export function pageExists(
    routePath: string,
    routesManifest: RoutesManifest,
): boolean {
    return routePath in routesManifest.pages;
}

export function getPageInfo(
    routePath: string,
    routesManifest: RoutesManifest,
): PageInfo | null {
    return routesManifest.pages[routePath] || null;
}
