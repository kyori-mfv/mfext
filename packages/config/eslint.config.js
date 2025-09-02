import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                console: "readonly",
                process: "readonly",
            },
        },
    },
    {
        ignores: [
            "**/dist/**",
            "**/node_modules/**",
            "**/*.cjs",
            "**/*.mjs",
            "**/public/**",
            "**/build/**",
        ],
    },
];
