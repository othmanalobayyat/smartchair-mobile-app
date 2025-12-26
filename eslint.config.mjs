import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    plugins: { react: pluginReact },
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Basics (مفيدة يوميًا)
      "no-unused-vars": "warn",

      // React Native: لا PropTypes
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      // SRP hints (خفيفة)
      "max-lines": [
        "warn",
        { max: 500, skipBlankLines: true, skipComments: true },
      ],
      "max-lines-per-function": [
        "warn",
        { max: 150, skipBlankLines: true, skipComments: true },
      ],
      complexity: ["warn", 20],
    },
  },

  // React recommended
  pluginReact.configs.flat.recommended,

  // Override بعد recommended عشان ما يرجّع prop-types
  {
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
]);
