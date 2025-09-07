import React from "react";
import type { AppRoute } from "~core/types";

interface AppRouterMainProps {
    route: AppRoute;
    components: Record<
        string,
        React.ComponentType<{ children?: React.ReactNode }>
    >;
}

export const AppRouterMain: React.FC<AppRouterMainProps> = ({
    route,
    components,
}) => {
    if (!route.page || !components[route.page]) {
        return <div>Page not found</div>;
    }

    const PageComponent = components[route.page];

    // If no layouts, just render the page
    if (!route.layouts.length) {
        return <PageComponent />;
    }

    // Render nested layouts
    const renderWithLayouts = (layoutIndex: number): React.ReactNode => {
        if (layoutIndex >= route.layouts.length) {
            return <PageComponent />;
        }

        const layoutPath = route.layouts[layoutIndex];
        const LayoutComponent = components[layoutPath];

        if (!LayoutComponent) {
            console.warn(`Layout component not found: ${layoutPath}`);
            return renderWithLayouts(layoutIndex + 1);
        }

        return (
            <LayoutComponent>
                {renderWithLayouts(layoutIndex + 1)}
            </LayoutComponent>
        );
    };

    return renderWithLayouts(0);
};

export default AppRouterMain;
