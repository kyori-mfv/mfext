import eslintConfig from "@mfext/config/eslint";

export default [
    ...eslintConfig,
    {
        ignores: ["!src/build/**"],
    },
];
