export interface PageInfo {
    component: string;
    title: string;
    path: string;
}

export interface RoutesManifest {
    pages: Record<string, PageInfo>;
    routes: string[];
}

export interface RSCProps {
    pageInfo: PageInfo;
}

export interface MainAppProps {
    pageComponent: React.ComponentType;
}
