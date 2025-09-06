"use client";

import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div
            style={{
                border: "2px solid #0070f3",
                borderRadius: "8px",
                padding: "1rem",
                margin: "1rem 0",
                background: "#f9f9f9",
            }}
        >
            <h3>Client Component Counter</h3>
            <p>
                Current count: <strong>{count}</strong>
            </p>
            <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
            >
                <button
                    onClick={() => setCount(count - 1)}
                    style={{
                        padding: "0.5rem 1rem",
                        background: "#ff4757",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Decrease
                </button>
                <button
                    onClick={() => setCount(count + 1)}
                    style={{
                        padding: "0.5rem 1rem",
                        background: "#2ed573",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Increase
                </button>
                <button
                    onClick={() => setCount(0)}
                    style={{
                        padding: "0.5rem 1rem",
                        background: "#5352ed",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Reset
                </button>
            </div>
            <p
                style={{
                    fontSize: "0.8rem",
                    color: "#666",
                    marginTop: "0.5rem",
                }}
            >
                ✨ This is a client component with interactive state!
            </p>
        </div>
    );
}
