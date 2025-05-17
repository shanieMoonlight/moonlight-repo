import { } from '@nx/angular';
import { libraryGenerator } from '@nx/angular/generators';
import { generateFiles, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { } from '@nx/js';
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from '../../@shared/schema/schema';
import { getDefaultOptions } from '../../@shared/utils/default-lib-options';
import { normalizeOptionsAsync } from '../../@shared/utils/options-utils';
import { PathUtils } from '../../@shared/utils/path-utils';
import { removeDefaultLibraryComponentFiles } from '../../@shared/utils/utility-functions';
import path = require('path');

//##############################################//

async function generateRouteDefsLibrary(tree: Tree, options: NoramlizedSectionGeneratorSchema) {

  const directory = PathUtils.combine(options.sectionRoot, '@route-defs')
  const importPath = PathUtils.combine(options.importPrefix, 'route-defs')
  const libraryName = options.libraryNamePrefix +'-route-defs'
  const defaultOptions = getDefaultOptions()

  const entryPointLibOptions = {
    ...defaultOptions,
    ...options,
    directory,
    importPath,
    name: libraryName,
  }
  
  await libraryGenerator(tree, entryPointLibOptions);
  removeDefaultLibraryComponentFiles(tree, directory, libraryName);

}

//------------------------------//

export async function sectionRouteDefsGenerator(tree: Tree, options: SectionGeneratorSchema) {

  const normalizedOptions = await normalizeOptionsAsync(tree, options);
  
  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, { ...normalizedOptions, projectType: 'library' });
  const sectionRoot = nameAndRootOptions.projectRoot;
  
  console.log(`Generating RouteDefs:`, normalizedOptions);

  await generateRouteDefsLibrary(tree, normalizedOptions);


  generateFiles(tree, path.join(__dirname, 'files'), sectionRoot, normalizedOptions);
  // await formatFiles(tree);
}

//##############################################//

export default sectionRouteDefsGenerator;

//##############################################//

// npx nx generate @nx/workspace:remove --projectName=sb-hub-blog-route-defs --no-interactive 