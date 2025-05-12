import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { DemoAppGeneratorSchema } from './schema';

//##############################################//

export async function demoAppGenerator(
  tree: Tree,
  options: DemoAppGeneratorSchema
) {
  // Change from libs to apps
  const projectRoot = `apps/${options.name}`;
  
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application', // Changed from 'library' to 'application'
    sourceRoot: `${projectRoot}/src`,
    targets: {
      build: {
        executor: '@angular-devkit/build-angular:application',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: `dist/apps/${options.name}`,
          index: `${projectRoot}/src/index.html`,
          browser: `${projectRoot}/src/main.ts`,
          polyfills: ['zone.js'],
          tsConfig: `${projectRoot}/tsconfig.app.json`,
          inlineStyleLanguage: 'scss',
          assets: [
            {
              glob: '**/*',
              input: `${projectRoot}/public`,
              output: '.'
            }
          ],
          styles: [`${projectRoot}/src/styles.scss`],
          scripts: []
        }
      },
      serve: {
        executor: '@angular-devkit/build-angular:dev-server',
        options: {
          port: 4200
        }
      }
    },
  });
  
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
}

//##############################################//

export default demoAppGenerator;

//##############################################//