export default {
  preset: 'ts-jest/presets/default-esm',
  setupFilesAfterEnv: ["./jest.setup.js"],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.test.json',
      },
    ],
  },
  coverageThreshold: {
    global: {
      branches: 90,
      statements: 90,
      functions: 90,
      lines: 90,
    },
  },
  extensionsToTreatAsEsm: [".ts"],
};
