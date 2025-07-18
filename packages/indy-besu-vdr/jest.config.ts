import type { Config } from '@jest/types'
import base from '../../jest.config.base'
import packageJson from './package.json'

const config: Config.InitialOptions = {
  ...base,
  displayName: packageJson.name,
  setupFilesAfterEnv: ['./tests/setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [],
  testMatch: [
    '**/tests/**/*.test.ts',
  ],
  // Add environment variable to run e2e tests
  ...(process.env.RUN_E2E_TESTS === 'true' && {
    testMatch: ['**/tests/**/*.test.ts'],
  }),
}

export default config