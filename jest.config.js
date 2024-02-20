export default {
  preset: 'ts-jest/presets/default-esm',
  setupFilesAfterEnv: ["./jest.setup.js"],
  coverageThreshold: {
    global: {
      branches: 90,
      statements: 90,
      functions: 90,
      lines: 90,
    },
  },
  globals: {
    structuredClone: {}
  },
  extensionsToTreatAsEsm: [".ts"],
};
