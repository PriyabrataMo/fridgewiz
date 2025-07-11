import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
    // Temporarily removed until stable v4 is released: 'plugin:tailwindcss/recommended'
  ),
  {
    rules: {
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
    },
  },
];

export default eslintConfig;
