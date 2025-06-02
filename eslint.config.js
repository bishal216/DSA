import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // Apply to all JS/TS files (including JSX/TSX)
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

    // 1) Use @typescript-eslint/parser so TS syntax is understood
    languageOptions: {
      parser: "@typescript-eslint/parser",
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },

    // 2) All recommended rules from JS, TS, React, and Prettier
    plugins: {
      js,
      "@typescript-eslint": tseslint,
      react: pluginReact,
      prettier: require("eslint-plugin-prettier"),
    },
    extends: [
      "js/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:prettier/recommended",
    ],

    // 3) Custom rule overrides
    rules: {
      // Disable outdated React 17+ rule
      "react/react-in-jsx-scope": "off",

      // Example: you can add more TS-specific overrides here
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
]);
