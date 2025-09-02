import React from "react";
import { MainAppProps } from "@/types";

const MainApp: React.FC<MainAppProps> = ({ pageComponent: PageComponent }) => {
    return PageComponent && <PageComponent />;
};

export default MainApp;
