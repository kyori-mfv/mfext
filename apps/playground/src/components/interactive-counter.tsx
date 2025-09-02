"use client";

import { useState, useEffect } from "react";

const InteractiveCounter: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const [hydrated, setHydrated] = useState<boolean>(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    return (
        <div>
            <p>
                <b>Count:</b> {count}
            </p>
            <button onClick={() => setCount((c) => c + 1)}>Increment</button>
            <p>Hydrated: {hydrated ? "yes" : "no"}</p>
        </div>
    );
};

export default InteractiveCounter;
