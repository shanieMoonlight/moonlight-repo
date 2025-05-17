import { } from '@nx/angular';
import { addProjectConfiguration, formatFiles, generateFiles, names, Tree, } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { } from '@nx/js';
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from '../../../@shared/schema/schema';
import { libraryGenerator as ngLibGenerator } from '@nx/angular/generators';
import { getDefaultOptions } from '../../../@shared/utils/default-lib-options';
import { PathUtils } from '../../../@shared/utils/path-utils';
import path = require('path');
import { normalizeOptionsAsync } from '../../../@shared/utils/options-utils';
import { removeDefaultLibraryComponentFiles } from '../../../@shared/utils/utilityFunctions';

//##############################################//

async function generateEntryPointLibrary(tree: Tree, options: NoramlizedSectionGeneratorSchema) {

  const directory = PathUtils.combine(options.sectionRoot,'features', 'home')
  const importPath = PathUtils.combine(options.importPrefix, 'features-home')
  const entryPointLibName = options.libraryNamePrefix + '-features-home'
  const defaultOptions = getDefaultOptions()

  const entryPointLibOptions = {
    ...defaultOptions,
    ...options,
    directory,
    importPath,
    name: entryPointLibName,
  }

  await ngLibGenerator(tree, entryPointLibOptions);


  // Clean up unwanted component files
  removeDefaultLibraryComponentFiles(tree, directory, entryPointLibName);

}

//------------------------------//

export async function generator(tree: Tree, options: SectionGeneratorSchema) {

  const normalizedOptions = await normalizeOptionsAsync(tree, options);
  console.log(`normalizedOptions:`, normalizedOptions);

  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, { ...normalizedOptions, projectType: 'library' });
  const sectionRoot = nameAndRootOptions.projectRoot;

  await generateEntryPointLibrary(tree, normalizedOptions);


  generateFiles(tree, path.join(__dirname, 'files'), sectionRoot, normalizedOptions);
  // await formatFiles(tree);
}

//##############################################//

export default generator;

//##############################################//




// npx nx generate @nx/workspace:remove --projectName=sb-hub-blog-features-home --no-interactive 