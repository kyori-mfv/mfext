"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";

export const NAVIGATION_EVENT = "mfext-navigation";

export interface RouterState {
    pathname: string;
}

export interface NavigationContextType {
    state: RouterState;
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    isNavigating: boolean;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

interface NavigationProviderProps {
    children: ReactNode;
    initialPath?: string;
}

export function NavigationProvider({
    children,
    initialPath = "/",
}: NavigationProviderProps) {
    const [state, setState] = useState<RouterState>(() => {
        if (typeof window !== "undefined") {
            return {
                pathname: window.location.pathname,
            };
        }
        return {
            pathname: initialPath,
        };
    });

    const [isNavigating, setIsNavigating] = useState(false);

    const updateState = useCallback((url: string) => {
        const pathname = url.split("?")[0];
        setState({ pathname });
    }, []);

    const push = useCallback(
        (url: string) => {
            if (typeof window !== "undefined") {
                setIsNavigating(true);

                // Update navigation state immediately
                updateState(url);

                // Dispatch navigation event - RSCManager will handle the rest
                window.dispatchEvent(
                    new CustomEvent(NAVIGATION_EVENT, {
                        detail: {
                            type: "navigate",
                            url,
                            method: "push",
                        },
                    }),
                );

                // Reset navigation state after a brief delay
                setTimeout(() => setIsNavigating(false), 100);
            }
        },
        [updateState],
    );

    const replace = useCallback(
        (url: string) => {
            if (typeof window !== "undefined") {
                setIsNavigating(true);

                // Update navigation state immediately
                updateState(url);

                // Dispatch navigation event - RSCManager will handle the rest
                window.dispatchEvent(
                    new CustomEvent(NAVIGATION_EVENT, {
                        detail: {
                            type: "navigate",
                            url,
                            method: "replace",
                        },
                    }),
                );

                // Reset navigation state after a brief delay
                setTimeout(() => setIsNavigating(false), 100);
            }
        },
        [updateState],
    );

    const back = useCallback(() => {
        if (typeof window !== "undefined") {
            window.history.back();
        }
    }, []);

    // Handle browser back/forward buttons
    React.useEffect(() => {
        if (typeof window === "undefined") return;

        const handlePopState = () => {
            setIsNavigating(true);

            // Update navigation state
            updateState(window.location.href);

            // RSCManager will handle popstate in its own listener
            // This just updates the navigation context state
            setTimeout(() => setIsNavigating(false), 100);
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [updateState]);

    const contextValue: NavigationContextType = {
        state,
        push,
        replace,
        back,
        isNavigating,
    };

    return (
        <NavigationContext.Provider value={contextValue}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigationContext() {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error(
            "useNavigationContext must be used within a NavigationProvider",
        );
    }
    return context;
}
