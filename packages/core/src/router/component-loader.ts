import React from "react";
import type { AppRoute } from "~core/types";

export class ComponentLoader {
    private componentCache: Map<
        string,
        React.ComponentType<{ children?: React.ReactNode }>
    > = new Map();

    /**
     * Load all components for a given route
     */
    async loadRouteComponents(
        route: AppRoute,
        componentImporter: (path: string) => Promise<unknown>,
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
            if (this.componentCache.has(componentPath)) {
                components[componentPath] =
                    this.componentCache.get(componentPath)!;
                return;
            }

            try {
                const module = await componentImporter(componentPath);
                const moduleWithDefault = module as {
                    default?: React.ComponentType<{
                        children?: React.ReactNode;
                    }>;
                };
                const Component =
                    moduleWithDefault.default ||
                    (module as React.ComponentType<{
                        children?: React.ReactNode;
                    }>);

                if (!Component) {
                    throw new Error(
                        `No default export found in ${componentPath}`,
                    );
                }

                this.componentCache.set(componentPath, Component);
                components[componentPath] = Component;
            } catch (error) {
                console.error(
                    `Failed to load component: ${componentPath}`,
                    error,
                );
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

    /**
     * Clear component cache
     */
    clearCache(): void {
        this.componentCache.clear();
    }

    /**
     * Get cached component
     */
    getCachedComponent(
        path: string,
    ): React.ComponentType<{ children?: React.ReactNode }> | undefined {
        return this.componentCache.get(path);
    }
}
