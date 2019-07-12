const { dev, mock } = require('../config/configs');

module.exports = {
  rootDir: '../',
  collectCoverageFrom: ['src/web/components/**/*.[jt]s?(x)', 'src/app/components/**/*.[jt]s?(x)'],
  setupFiles: ['<rootDir>/test/setup.js'],
  testMatch: ['<rootDir>/src/**/*.e2e.[jt]s?(x)'],
  setupFilesAfterEnv: ['./node_modules/jest-enzyme/lib/index.js'],
  testEnvironment: 'enzyme',
  testURL: `http://${dev.host}:${dev.port}/dist/`,
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.m\\.(less|scss)$': '<rootDir>/node_modules/jest-css-modules-transform',
    '^.+\\.(css|less|scss)$': '<rootDir>/test/transforms/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|less|scss|json)$)': '<rootDir>/test/transforms/fileTransform.js'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es/).+(js|jsx|ts|tsx|mjs)$'],
  moduleNameMapper: {
    '^puppeteer$': '<rootDir>/node_modules/puppeteer-core'
  },
  coverageDirectory: 'test/coverage',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  globals: {
    __HOST: `'http://${mock.host}:${mock.port}/'`
  }
};
