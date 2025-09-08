"use client";

import { Link } from "@kyori-mfv/mfext-navigation";
import { useState } from "react";

export function DashboardSidebar() {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <aside
            style={{
                width: isExpanded ? "200px" : "60px",
                background: "#f5f5f5",
                padding: "1rem",
                transition: "width 0.3s ease",
            }}
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ marginBottom: "1rem", width: "100%" }}
            >
                {isExpanded ? "←" : "→"}
            </button>

            {isExpanded && (
                <>
                    <h3>Dashboard Menu</h3>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li style={{ marginBottom: "0.5rem" }}>
                            <Link
                                href="/dashboard"
                                style={{
                                    color: "blue",
                                    textDecoration: "none",
                                }}
                            >
                                Overview
                            </Link>
                        </li>
                        <li style={{ marginBottom: "0.5rem" }}>
                            <Link
                                href="/dashboard/stats"
                                style={{
                                    color: "blue",
                                    textDecoration: "none",
                                }}
                            >
                                Statistics
                            </Link>
                        </li>
                        <li style={{ marginBottom: "0.5rem" }}>
                            <Link
                                href="/navigation-demo"
                                style={{
                                    color: "blue",
                                    textDecoration: "none",
                                }}
                            >
                                Nav Demo
                            </Link>
                        </li>
                    </ul>
                </>
            )}
        </aside>
    );
}
