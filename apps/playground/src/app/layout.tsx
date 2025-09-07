"use client";

import { NavigationHeader } from "./navigation-header";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <title>MFExt App Router</title>
            </head>
            <body>
                <NavigationHeader />
                <main>{children}</main>
            </body>
        </html>
    );
}
