"use client";

import { NavigationHeader } from "./navigation-header";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <NavigationHeader />
                <main>{children}</main>
            </body>
        </html>
    );
}
