import { libraryGenerator } from '@nx/angular/generators';
import {
  generateFiles,
  Tree
} from '@nx/devkit';
import * as path from 'path';
import { GeneratorUtils } from '../../../@shared/utils/generator-utils';
import { getDefaultOptions } from '../../../@shared/utils/options/default-lib-options';
import { NewFeatureOptionsUtils } from './options-utils';
import { NoramlizedSectionNewFeatureGeneratorSchema, SectionNewFeatureGeneratorSchema } from './schema';


//------------------------------//

async function generateNewFeatureLibrary(tree: Tree, options: NoramlizedSectionNewFeatureGeneratorSchema) {

  const directory = options.libraryRoot
  const libraryName = options.libraryName
  const importPath = options.importPath
  const defaultOptions = getDefaultOptions()


  const libOptions = {
    ...defaultOptions,
    ...options,
    directory,
    importPath,
    name: libraryName,
  }

  await libraryGenerator(tree, libOptions);


  // Clean up and edit
  GeneratorUtils.removeDefaultLibraryComponentFiles(tree, directory, libraryName);
  GeneratorUtils.addCustomEslintRules(tree, directory);

}

//------------------------------//

export async function newFeatureGenerator(tree: Tree, options: SectionNewFeatureGeneratorSchema) {

  const normalizedOptions = await NewFeatureOptionsUtils.normalizeOptionsAsync(tree, options)
  await generateNewFeatureLibrary(tree, normalizedOptions);

  console.log(`normalizedOptions:`, normalizedOptions)

  const libraryRoot = normalizedOptions.libraryRoot;


  // console.log(`libraryRoot:`, libraryRoot);
  // console.log(`path.join(__dirname, 'files'):`, path.join(__dirname, 'files'));

  generateFiles(tree, path.join(__dirname, 'files'), libraryRoot, normalizedOptions);
  // await formatFiles(tree);
}

//##############################################//

export default newFeatureGenerator;


//##############################################//