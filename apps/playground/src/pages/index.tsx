import InteractiveCounter from "../components/interactive-counter";
import React from "react";

const IndexPage: React.FC = () => {
    return (
        <div>
            <h1>Raw React SSR Demo</h1>
            <InteractiveCounter />
        </div>
    );
};

export default IndexPage;
