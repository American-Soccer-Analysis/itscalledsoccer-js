import globals from "globals";
import jestPlugin from "eslint-plugin-jest"
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { jest: jestPlugin },
  },
];