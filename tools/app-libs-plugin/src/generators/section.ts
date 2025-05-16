import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import { libraryGenerator, librarySecondaryEntryPointGenerator } from '@nx/angular/generators';
import { } from '@nx/angular';
import * as path from 'path';
import { SectionGeneratorSchema } from './schema';

export async function sectionGenerator(
  tree: Tree,
  options: SectionGeneratorSchema
) {
  const projectRoot = `libs/${options.name}`;
  console.log(`Creating section ${options.name} in ${projectRoot}`);
  console.log('ioptions', options);
  
  
  // addProjectConfiguration(tree, options.name, {
  //   root: projectRoot,
  //   projectType: 'library',
  //   sourceRoot: `${projectRoot}/src`,
  //   targets: {},
  // });
  // generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  // await formatFiles(tree);
}

export default sectionGenerator;
