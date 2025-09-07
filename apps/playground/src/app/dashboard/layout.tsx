"use client";

import { DashboardSidebar } from "./dashboard-sidebar";
import Counter from "../components/counter";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex" }}>
            <DashboardSidebar />
            <Counter />
            <div style={{ flex: 1, padding: "1rem" }}>{children}</div>
        </div>
    );
}
