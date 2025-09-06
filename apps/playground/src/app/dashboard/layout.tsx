export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex" }}>
            <aside
                style={{
                    width: "200px",
                    background: "#f5f5f5",
                    padding: "1rem",
                }}
            >
                <h3>Dashboard Menu</h3>
                <ul>
                    <li>Overview</li>
                    <li>Settings</li>
                    <li>Reports</li>
                </ul>
            </aside>
            <div style={{ flex: 1, padding: "1rem" }}>{children}</div>
        </div>
    );
}
