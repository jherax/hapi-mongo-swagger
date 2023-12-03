const config = {
  rootDir: '../',
  cache: true,
  cacheDirectory: '<rootDir>/.cache',
  testEnvironment: 'node',
  // Prevent tests from printing messages through the console
  silent: true,
  verbose: false,
  transform: {
    '^.+\\.tsx?$': [
      // https://miyauchi.dev/posts/speeding-up-jest/
      // https://swc.rs/docs/configuration/compilation
      '@swc/jest', // ts-jest, esbuild-jest
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            dynamicImport: true,
            decorators: true,
            decoratorsBeforeExport: true,
            importMeta: true,
          },
        },
        isModule: true,
      },
    ],
  },
  roots: ['<rootDir>/backend', '<rootDir>/scripts'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // setupFiles: ['<rootDir>/config/jest.env.js'],
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  // All imported modules in your tests should be mocked automatically
  // automock: false,
  // Automatically clear mock calls and instances between every test
  // clearMocks: true,
  // Setting this value to "fake" allows the use of fake timers for functions such as "setTimeout"
  // timers: 'fake',
};

module.exports = config;
