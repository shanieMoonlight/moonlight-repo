import { } from '@nx/angular';
import { libraryGenerator, librarySecondaryEntryPointGenerator } from '@nx/angular/generators';
import { generateFiles, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from '../../@shared/schema/schema';
import { getDefaultOptions } from '../../@shared/utils/default-lib-options';
import { normalizeOptionsAsync } from '../../@shared/utils/options-utils';
import { PathUtils } from '../../@shared/utils/path-utils';
import { removeDefaultLibraryComponentFiles } from '../../@shared/utils/utilityFunctions';
import path = require('path');

//##############################################//

async function generateConfigLibrary(tree: Tree, options: NoramlizedSectionGeneratorSchema) {

  const directory = PathUtils.combine(options.sectionRoot, 'config')
  const importPath = PathUtils.combine(options.importPrefix, 'config')
  const libraryName = options.libraryNamePrefix + '-config'
  const defaultOptions = getDefaultOptions()

  const entryPointLibOptions = {
    ...defaultOptions,
    ...options,
    directory,
    importPath,
    name: libraryName,
  }


  await libraryGenerator(tree, entryPointLibOptions);
  await librarySecondaryEntryPointGenerator(tree, {
    library: libraryName,
    name: 'constants',
    skipModule: true,
    skipFormat: true

  })

  removeDefaultLibraryComponentFiles(tree, directory, libraryName);

}

//------------------------------//

export async function sectionConfigGenerator(tree: Tree, options: SectionGeneratorSchema) {

  const normalizedOptions = await normalizeOptionsAsync(tree, options);

  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, { ...normalizedOptions, projectType: 'library' });
  const sectionRoot = nameAndRootOptions.projectRoot;
  
  console.log(`Generating Config:`, normalizedOptions);
  
  await generateConfigLibrary(tree, normalizedOptions);


  generateFiles(tree, path.join(__dirname, 'files'), sectionRoot, normalizedOptions);
  // await formatFiles(tree);
}

//##############################################//

export default sectionConfigGenerator;

//##############################################//

// npx nx generate @nx/workspace:remove --projectName=sb-hub-blog-config --no-interactive 