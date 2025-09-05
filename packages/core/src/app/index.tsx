import React from "react";
import { MainAppProps } from "~core/types";

const MainApp: React.FC<MainAppProps> = ({ pageComponent: PageComponent }) => {
    return PageComponent && <PageComponent />;
};

export default MainApp;
