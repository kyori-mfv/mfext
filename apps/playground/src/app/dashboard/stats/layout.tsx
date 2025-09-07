export default function DashboardStatsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <header>
                <h2>Dashboard Stats</h2>
            </header>
            <div
                style={{ flex: 1, padding: "1rem", backgroundColor: "#f5f5f5" }}
            >
                {children}
            </div>
        </div>
    );
}
