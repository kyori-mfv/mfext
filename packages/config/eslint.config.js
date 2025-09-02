import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

export default [
    js.configs.recommended,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        ignores: ["**/dist/**", "**/node_modules/**"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
            },
            globals: {
                console: "readonly",
                process: "readonly",
                Buffer: "readonly",
                global: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
    prettier,
];
