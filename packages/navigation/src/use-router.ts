"use client";

import { useNavigationContext } from "./context.js";

export interface NextRouterType {
    pathname: string;
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
}

export function useRouter(): NextRouterType {
    const { state, push, replace, back } = useNavigationContext();

    return {
        pathname: state.pathname,
        push,
        replace,
        back,
    };
}
