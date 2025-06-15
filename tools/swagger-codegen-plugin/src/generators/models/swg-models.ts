import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { SwgModelsGeneratorSchema } from './schema';
import { GeneratorUtils, getDefaultLibraryOptions } from "@spider-baby/generators-utils";

export async function swgModelsGenerator(
  tree: Tree,
  options: SwgModelsGeneratorSchema
) {
  const projectRoot = `libs/${options.name}`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
}

export default swgModelsGenerator;
