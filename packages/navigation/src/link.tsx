"use client";

import React, { MouseEvent, ReactNode, forwardRef } from "react";
import { useNavigationContext } from "./context.js";

export interface LinkProps {
    href: string;
    children: ReactNode;
    replace?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
    { href, children, replace = false, className, style, onClick },
    ref,
) {
    const { push, replace: routerReplace } = useNavigationContext();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);

        if (e.defaultPrevented || href.startsWith("http")) {
            return;
        }

        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
            return;
        }

        e.preventDefault();

        if (replace) {
            routerReplace(href);
        } else {
            push(href);
        }
    };

    return (
        <a
            ref={ref}
            href={href}
            className={className}
            style={style}
            onClick={handleClick}
        >
            {children}
        </a>
    );
});
