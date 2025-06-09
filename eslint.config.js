import vue from "eslint-plugin-vue";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import vueEslintParser from "vue-eslint-parser";

export default [
  {
    files: ["**/*.ts", "**/*.vue"],
    ignores: ["**/*.js"],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: [".vue"],
        ecmaVersion: 2020,
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      vue: vue,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...vue.configs.recommended.rules,
      "no-console": ["off"],
      "no-debugger": ["error"],
      "@typescript-eslint/no-explicit-any": ["off"],
      "vue/no-v-html": ["off"],
      //"complexity": ["warn", 10] ,
      //"max-depth": ["warn", 5],
      //"max-lines": ["warn", { max: 200, skipBlankLines: true, skipComments: true }]
    },
  },
];
