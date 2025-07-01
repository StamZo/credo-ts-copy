import type { Config } from '@jest/types'
import base from '../../jest.config.base'
import packageJson from './package.json'

const config: Config.InitialOptions = {
  ...base,
  displayName: packageJson.name,
  setupFilesAfterEnv: ['./tests/setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest', // <-- THIS IS IMPORTANT!
  },
  transformIgnorePatterns: [],
}

export default config
