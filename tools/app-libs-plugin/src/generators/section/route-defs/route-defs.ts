import { } from '@nx/angular';
import { addProjectConfiguration, formatFiles, generateFiles, names, Tree, } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { } from '@nx/js';
import { libraryGenerator } from '@nx/angular/generators';
import { getDefaultOptions } from '../../@shared/utils/default-lib-options';
import { PathUtils } from '../../@shared/utils/path-utils';
import path = require('path');
import { SectionGeneratorSchema, NoramlizedSectionGeneratorSchema } from '../../@shared/schema/schema';
import { normalizeOptionsAsync } from '../../@shared/utils/options-utils';
import { removeDefaultLibraryComponentFiles } from '../../@shared/utils/utilityFunctions';

//##############################################//

async function generateRouteDefsLibrary(tree: Tree, options: NoramlizedSectionGeneratorSchema) {

  const directory = PathUtils.combine(options.sectionRoot, '@route-defs')
  const importPath = PathUtils.combine(options.importPrefix, 'route-defs')
  const entryPointLibName = options.libraryNamePrefix +'-route-defs'
  const defaultOptions = getDefaultOptions()

  const entryPointLibOptions = {
    ...defaultOptions,
    ...options,
    directory,
    importPath,
    name: entryPointLibName,
  }

  
  await libraryGenerator(tree, entryPointLibOptions);
  removeDefaultLibraryComponentFiles(tree, directory, entryPointLibName);

}

//------------------------------//

export async function generator(tree: Tree, options: SectionGeneratorSchema) {

  const normalizedOptions = await normalizeOptionsAsync(tree, options);
  
  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, { ...normalizedOptions, projectType: 'library' });
  const sectionRoot = nameAndRootOptions.projectRoot;
  
  console.log(`normalizedOptions?:`, normalizedOptions);
  await generateRouteDefsLibrary(tree, normalizedOptions);


  generateFiles(tree, path.join(__dirname, 'files'), sectionRoot, normalizedOptions);
  // await formatFiles(tree);
}

//##############################################//

export default generator;

//##############################################//

// npx nx generate @nx/workspace:remove --projectName=sb-hub-blog-route-defs --no-interactive 