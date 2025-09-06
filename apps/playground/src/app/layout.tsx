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
                    <nav>
                        <a href="/">Home</a> |{" "}
                        <a href="/dashboard">Dashboard</a>
                    </nav>
                </header>
                <main>{children}</main>
            </body>
        </html>
    );
}
