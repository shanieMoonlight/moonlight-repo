export default {
  displayName: 'theming',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../../../coverage/libs/packages/@spider-baby/theming',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  // moduleNameMapper: {
  //   '^@spider-baby/material-theming/service$': '<rootDir>/../service/src/index.ts',
  //   '^@spider-baby/material-theming/utils$': '<rootDir>/../utils/src/index.ts',
  //   '^@spider-baby/material-theming/ui$': '<rootDir>/../ui/src/index.ts',
  //   '^@spider-baby/utils-testing$': '<rootDir>/../../../utils/testing/src/index.ts',
  //   '^@spider-baby/utils-memoization$': '<rootDir>/../../../utils/memoization/src/index.ts',
  //   // Add other aliases as needed
  // },
  transformIgnorePatterns: [
    // 'node_modules/(?!.*\\.mjs$)',
    // 'node_modules/(?!(\\@spider-baby|@material/material-color-utilities)/)'transformIgnorePatterns: [
    'node_modules/(?!@angular|@material/material-color-utilities|ngx-highlightjs)'
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
