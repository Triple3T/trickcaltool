module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "enums": "always-multiline",
      "functions": "never"
    }],
    "@typescript-eslint/no-unused-vars": "warn",
    "no-unused-vars": "off",
    "max-len": ["error", {
      "code": 100,
      "ignoreUrls": true,
      "ignoreTemplateLiterals": true,
      "ignoreComments": true,
      "ignoreStrings": true
    }],
    "object-curly-newline": "off",
    "react/jsx-one-expression-per-line": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "template-curly-spacing": ["error", "never"],
    "react/react-in-jsx-scope": "off",
    "comma-dangle": "off",
  },
}
