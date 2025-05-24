import type { Config } from 'jest';

export default async (): Promise<Config> => ({
  displayName: 'spider-baby',
  preset: './jest.preset.js',
  testEnvironment: 'jsdom', 
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
    // Ensure @spider-baby packages are transformed if needed
    'node_modules/(?!.*\\.mjs$|@angular|@ngrx|rxjs|@spider-baby|@material/material-color-utilities)'
  ],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    // Add specific mappings matching tsconfig.base.json
  '^@angular/animations/browser$': '<rootDir>/node_modules/@angular/animations/fesm2022/browser.mjs',
  
    '^@spider-baby/mat-notifications$': '<rootDir>/libs/ui/notifications/mat-notifications/src/index.ts',
    '^@spider-baby/mini-state$': '<rootDir>/libs/packages/@spider-baby/mini-state/src/index.ts',
    '^@spider-baby/material-theming$': '<rootDir>/libs/packages/@spider-baby/theming/src/index.ts',
    '^@spider-baby/material-theming/config$': '<rootDir>/libs/packages/@spider-baby/theming/config/src/index.ts',
    '^@spider-baby/material-theming/components$': '<rootDir>/libs/packages/@spider-baby/theming/components/src/index.ts',
    '^@spider-baby/material-theming/service$': '<rootDir>/libs/packages/@spider-baby/theming/service/src/index.ts',
    '^@spider-baby/material-theming/customizer$': '<rootDir>/libs/packages/@spider-baby/theming/customizer/src/index.ts',
    '^@spider-baby/material-theming/showcase$': '<rootDir>/libs/packages/@spider-baby/theming/showcase/src/index.ts',
    '^@spider-baby/material-theming/ui$': '<rootDir>/libs/packages/@spider-baby/theming/ui/src/index.ts',
    '^@spider-baby/material-theming/utils$': '<rootDir>/libs/packages/@spider-baby/theming/utils/src/index.ts',
    '^@spider-baby/ssr-storage$': '<rootDir>/libs/packages/@spider-baby/ssr/storage/src/index.ts',

    // Keep a generic one as a fallback if needed, but ensure it's correct
    // '^@spider-baby/(.*)$': '<rootDir>/libs/packages/@spider-baby/$1', // This might still be too generic
  },
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.nx/cache',
    '<rootDir>/dist',
    '<rootDir>/_examples/',
    '_examples/',
    '<rootDir>/apps/mini-state/demo-e2e/',
    '<rootDir>/apps/sb-mat-thm-demo-e2e/',
    '<rootDir>/apps/tutorials/tutorials-e2e/',
    '<rootDir>/apps/hub/sb-hub-e2e/',
    '<rootDir>/apps/routes/routes-e2e/',
    '<rootDir>/tools/demo-plugin/src/generators/files/',
    '<rootDir>/tools/app-libs-plugin/src/generators/section/entry-point/files/',
    '<rootDir>/tools/app-libs-plugin/src/generators/section/route-defs/files/',
    '<rootDir>/tools/app-libs-plugin/src/generators/section/features/home/files/',
    '<rootDir>/tools/app-libs-plugin/src/generators/section/ui/nav/files/',
    '<rootDir>/tools/app-libs-plugin/src/generators/section/features/new/files/',
    '<rootDir>/tools/shortcuts-plugin/src/generators/library/files/',
    '<rootDir>/tools/shortcuts-plugin/src/generators/component/files/',
  ],
});