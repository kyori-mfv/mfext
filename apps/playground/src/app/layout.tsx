export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <header>
                    <h1>MFExt App</h1>
                    <nav style={{ display: "flex", gap: "1rem" }}>
                        <a href="/">Home</a>
                        <a href="/dashboard">Dashboard</a>
                        <a href="/dashboard/stats">Stats</a>
                    </nav>
                </header>
                <main>{children}</main>
            </body>
        </html>
    );
}
