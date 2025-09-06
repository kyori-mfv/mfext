import React from "react";
import type { AppRoutesManifest, AppRoute } from "~core/types";
import * as fs from "fs-extra";
import { getBuildConfig } from "../build/build-config.js";
import { AppRouter } from "./app-router";

let appRouterInstance: AppRouter | null = null;

export async function loadAppRoutesManifest(): Promise<AppRoutesManifest> {
    const buildConfig = getBuildConfig();
    return fs
        .readJson(buildConfig.appRoutesManifestPath)
        .catch(() => ({ routes: {}, tree: { path: "/", children: {} } }));
}

export async function getAppRouter(): Promise<AppRouter> {
    if (!appRouterInstance) {
        const manifest = await loadAppRoutesManifest();
        appRouterInstance = new AppRouter(manifest);
    }
    return appRouterInstance;
}

export async function getAppRoute(pathname: string): Promise<AppRoute | null> {
    const router = await getAppRouter();
    return router.resolveRoute(pathname);
}

export async function getAllAppRoutes(): Promise<string[]> {
    const router = await getAppRouter();
    return router.getAvailableRoutes();
}

export async function appRouteExists(pathname: string): Promise<boolean> {
    const route = await getAppRoute(pathname);
    return route !== null;
}

export async function loadAppComponent(
    componentPath: string,
): Promise<{ default: React.ComponentType }> {
    try {
        return await import(`@/app/${componentPath}`);
    } catch (error) {
        console.error(
            `Failed to load App Router component: ${componentPath}`,
            error,
        );
        throw new Error(`App Router component not found: ${componentPath}`);
    }
}

export async function loadAllAppComponents(
    route: AppRoute,
): Promise<
    Record<string, React.ComponentType<{ children?: React.ReactNode }>>
> {
    const components: Record<
        string,
        React.ComponentType<{ children?: React.ReactNode }>
    > = {};
    const pathsToLoad = [...route.layouts, route.page];

    // Load all components in parallel
    const loadPromises = pathsToLoad.map(async (componentPath) => {
        try {
            const module = await loadAppComponent(componentPath);
            const Component = module.default;

            if (!Component) {
                throw new Error(`No default export found in ${componentPath}`);
            }

            components[componentPath] = Component;
        } catch (error) {
            console.error(`Failed to load component: ${componentPath}`, error);
            // Create a fallback error component
            components[componentPath] = () =>
                React.createElement(
                    "div",
                    {
                        style: {
                            color: "red",
                            border: "1px solid red",
                            padding: "1rem",
                        },
                    },
                    `Error loading component: ${componentPath}`,
                );
        }
    });

    await Promise.all(loadPromises);
    return components;
}
