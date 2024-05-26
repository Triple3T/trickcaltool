module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: [
    "react",
    "react-hooks",
    "react-refresh",
    "@typescript-eslint",
    "@stylistic/ts",
    "eslint-plugin-react-compiler",
  ],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@stylistic/ts/comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "enums": "always-multiline",
      "tuples": "always-multiline",
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
    "react/prop-types": "off",
    "react/no-unknown-property": "off",
    "react-compiler/react-compiler": "error",
  },
  settings: {
      "react": {
          "version": "detect",
      },
  },
}
