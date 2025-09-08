"use client";

import { useRouter, Link } from "@kyori-mfv/mfext-navigation";
import { useState } from "react";

export default function NavigationDemo() {
    const router = useRouter();
    const [counter, setCounter] = useState(0);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Navigation Demo</h2>

            <div
                style={{
                    marginBottom: "2rem",
                    padding: "1rem",
                    border: "1px solid #ccc",
                }}
            >
                <h3>Current Route Info</h3>
                <p>
                    <strong>Pathname:</strong> {router.pathname}
                </p>
                <p>
                    <em>
                        Simplified router only provides pathname, push, replace,
                        and back methods
                    </em>
                </p>
            </div>

            <div
                style={{
                    marginBottom: "2rem",
                    padding: "1rem",
                    border: "1px solid #ccc",
                }}
            >
                <h3>Link Component Demo</h3>
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        marginBottom: "1rem",
                    }}
                >
                    <Link
                        href="/dashboard"
                        style={{
                            color: "blue",
                            textDecoration: "none",
                            padding: "0.5rem",
                            border: "1px solid blue",
                        }}
                    >
                        Link to Dashboard
                    </Link>
                    <Link
                        href="/dashboard/stats"
                        replace
                        style={{
                            color: "green",
                            textDecoration: "none",
                            padding: "0.5rem",
                            border: "1px solid green",
                        }}
                    >
                        Replace to Stats
                    </Link>
                </div>
                <p>
                    <em>
                        Links use client-side navigation without page reload
                    </em>
                </p>
            </div>

            <div
                style={{
                    marginBottom: "2rem",
                    padding: "1rem",
                    border: "1px solid #ccc",
                }}
            >
                <h3>useRouter Hook Demo</h3>
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        marginBottom: "1rem",
                    }}
                >
                    <button onClick={() => router.push("/dashboard")}>
                        router.push('/dashboard')
                    </button>
                    <button onClick={() => router.replace("/")}>
                        router.replace('/')
                    </button>
                    <button onClick={() => router.back()}>router.back()</button>
                </div>
                <p>
                    <em>Buttons demonstrate programmatic navigation</em>
                </p>
            </div>

            <div
                style={{
                    marginBottom: "2rem",
                    padding: "1rem",
                    border: "1px solid #ccc",
                }}
            >
                <h3>Layout Persistence Demo</h3>
                <p>Counter: {counter}</p>
                <button onClick={() => setCounter((c) => c + 1)}>
                    Increment Counter
                </button>
                <p>
                    <em>
                        Navigate away and back - component state should persist
                        in layout
                    </em>
                </p>
            </div>
        </div>
    );
}
