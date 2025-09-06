// App Router types
export interface AppRouteSegment {
    path: string;
    page?: string;
    layout?: string;
    loading?: string;
    error?: string;
    notFound?: string;
    children: Record<string, AppRouteSegment>;
}

export interface AppRoute {
    path: string;
    segments: string[];
    page: string;
    layouts: string[];
}

export interface AppRoutesManifest {
    routes: Record<string, AppRoute>;
    tree: AppRouteSegment;
}

export interface AppRouterProps {
    route: AppRoute;
    params?: Record<string, string>;
}

export interface LayoutProps {
    children: React.ReactNode;
    params?: Record<string, string>;
}
