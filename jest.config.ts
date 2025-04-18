import type { Config } from 'jest';
import { getJestProjectsAsync } from '@nx/jest';

export default async (): Promise<Config> => ({
  displayName: 'moonlight',
  preset: './jest.preset.js',
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  extensionsToTreatAsEsm: ['.ts'],
  resolver: '@nx/jest/plugins/resolver',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg|scss)$',
      useESM: true,
    },
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: [
    // Ensure @moonlight packages are transformed if needed
    'node_modules/(?!.*\\.mjs$|@angular|@ngrx|rxjs|@moonlight|@material/material-color-utilities)'
  ],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    // Add specific mappings matching tsconfig.base.json
  '^@angular/animations/browser$': '<rootDir>/node_modules/@angular/animations/fesm2022/browser.mjs',
  
    '^@moonlight/ng/theming$': '<rootDir>/libs/packages/@moonlight/theming/src/index.ts',
    '^@moonlight/ng/theming/config$': '<rootDir>/libs/packages/@moonlight/theming/config/src/index.ts',
    '^@moonlight/ng/theming/mat$': '<rootDir>/libs/packages/@moonlight/theming/mat/src/index.ts',
    '^@moonlight/ng/theming/service$': '<rootDir>/libs/packages/@moonlight/theming/service/src/index.ts',
    '^@moonlight/ssr-storage$': '<rootDir>/libs/packages/@moonlight/ssr/storage/src/index.ts',

    // Keep a generic one as a fallback if needed, but ensure it's correct
    // '^@moonlight/(.*)$': '<rootDir>/libs/packages/@moonlight/$1', // This might still be too generic
  },
  modulePathIgnorePatterns: [
    '<rootDir>/.nx/cache',
    '<rootDir>/dist'
  ],
});