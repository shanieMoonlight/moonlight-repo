const { pathsToModuleNameMapper } = require('ts-jest');
const { readFileSync } = require('fs');
const { join } = require('path');

console.log('🔍 Debugging Jest Configuration...\n');

// Read the theming tsconfig.spec.json
const themingTsconfigPath = join(__dirname, 'libs/packages/@spider-baby/theming/tsconfig.spec.json');
const themingTsconfig = JSON.parse(readFileSync(themingTsconfigPath, 'utf8'));

console.log('📁 Theming tsconfig.spec.json paths:');
const themingPaths = themingTsconfig.compilerOptions?.paths || {};
Object.keys(themingPaths).forEach(key => {
  console.log(`  ${key}: ${JSON.stringify(themingPaths[key])}`);
});

console.log('\n🗺️ Generated moduleNameMapper:');
const moduleMapper = pathsToModuleNameMapper(themingPaths, {
  prefix: '<rootDir>/../../../../',
}) || {};

Object.keys(moduleMapper).forEach(key => {
  console.log(`  "${key}": "${moduleMapper[key]}"`);
});

console.log('\n📍 Base tsconfig.base.json paths:');
const baseTsconfig = JSON.parse(readFileSync(join(__dirname, 'tsconfig.base.json'), 'utf8'));
const basePaths = baseTsconfig.compilerOptions?.paths || {};
const relevantKeys = Object.keys(basePaths).filter(key => 
  key.includes('@spider-baby/material-theming') || 
  key.includes('@spider-baby/utils-') || 
  key.includes('@spider-baby/ssr-storage')
);

relevantKeys.forEach(key => {
  console.log(`  ${key}: ${JSON.stringify(basePaths[key])}`);
});
