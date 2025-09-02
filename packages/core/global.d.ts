declare module "react-server-dom-webpack/server.node" {
    export function renderToPipeableStream(
        children: React.ReactNode,
        manifest: unknown,
        options?: {
            bootstrapScripts?: string[];
            bootstrapScriptContent?: string;
            onAllReady?: () => void;
            onError?: (error: Error) => void;
            onCompleteShell?: () => void;
            onCompleteAll?: () => void;
        },
    ): {
        pipe: (destination: NodeJS.WritableStream) => void;
        abort: () => void;
    };
}

declare module "react-server-dom-webpack/client" {
    export function createFromFetch(
        response: Response,
        options?: {
            callServer?: (id: string, args: unknown[]) => Promise<unknown>;
        },
    ): Promise<React.ReactNode>;
    export function createFromReadableStream(
        readableStream: ReadableStream,
        options?: {
            callServer?: (id: string, args: unknown[]) => Promise<unknown>;
        },
    ): Promise<React.ReactNode>;
}
