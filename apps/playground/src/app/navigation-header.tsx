"use client";

import { Link } from "@mfext/navigation";

export function NavigationHeader() {
    return (
        <header>
            <h1>MFExt App with Navigation</h1>
            <nav style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                <Link
                    href="/"
                    style={{ color: "blue", textDecoration: "none" }}
                >
                    Home
                </Link>
                <Link
                    href="/dashboard"
                    style={{ color: "blue", textDecoration: "none" }}
                >
                    Dashboard
                </Link>
                <Link
                    href="/dashboard/stats"
                    style={{ color: "blue", textDecoration: "none" }}
                >
                    Stats
                </Link>
                <Link
                    href="/navigation-demo"
                    style={{ color: "blue", textDecoration: "none" }}
                >
                    Navigation Demo
                </Link>
            </nav>
        </header>
    );
}
