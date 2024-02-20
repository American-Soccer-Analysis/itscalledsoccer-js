module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
    browser: true,
  },
  extends: [
    "eslint:recommended", 
    "plugin:@typescript-eslint/recommended", 
    "prettier"
  ],
  parser: '@typescript-eslint/parser',
  plugins: ["jest", "@typescript-eslint"],
  root: true
};
