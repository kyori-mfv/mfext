import eslintConfig from "@kyori-mfv/mfext-config/eslint";

export default [
    ...eslintConfig,
    {
        ignores: ["!src/build/**"],
    },
];
