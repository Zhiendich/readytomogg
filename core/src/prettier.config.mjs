/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: "all",
  tabWidth: 2,
  printWidth: 100,
  arrowParens: "always",
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: [
    "classProperties",
    "decorators-legacy",
    "typescript",
  ],
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^@viebly/core/(.*)$",
    "^@/(.*)$",
    "^../(.*)",
    "^./(.*)$",
  ],
  plugins: ["@trivago/prettier-plugin-sort-imports"],
};

export default config;
