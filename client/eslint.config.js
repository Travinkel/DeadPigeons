// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config({
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      ...globals.browser,
      ...globals.node,
    },
    parser: tseslint.parser,
  },
  plugins: {
    "@typescript-eslint": tseslint.plugin,
  },
  rules: {
    ...js.configs.recommended.rules,
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
});
