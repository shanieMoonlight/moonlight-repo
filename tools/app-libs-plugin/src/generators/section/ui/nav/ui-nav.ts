import { } from '@nx/angular';
import { libraryGenerator as ngLibGenerator } from '@nx/angular/generators';
import { generateFiles, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { } from '@nx/js';
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from '../../../@shared/schema/schema';
import { getDefaultOptions } from '../../../@shared/utils/default-lib-options';
import { normalizeOptionsAsync } from '../../../@shared/utils/options-utils';
import { PathUtils } from '../../../@shared/utils/path-utils';
import { addCustomEslintRules, removeDefaultLibraryComponentFiles } from '../../../@shared/utils/utility-functions';
import path = require('path');

//##############################################//

async function generateUiNavLibrary(tree: Tree, options: NoramlizedSectionGeneratorSchema) {

  const directory = PathUtils.combine(options.sectionRoot,'ui', 'nav')
  const importPath = PathUtils.combine(options.importPrefix, 'ui-nav')
  const libraryName = options.libraryNamePrefix + '-ui-nav'
  const defaultOptions = getDefaultOptions()

  const entryPointLibOptions = {
    ...defaultOptions,
    ...options,
    directory,
    importPath,
    name: libraryName,
  }

  await ngLibGenerator(tree, entryPointLibOptions);


  // Clean up and edit
  removeDefaultLibraryComponentFiles(tree, directory, libraryName);
  addCustomEslintRules(tree, directory);

}

//------------------------------//

export async function sectionUiNavGenerator(tree: Tree, options: SectionGeneratorSchema) {

  const normalizedOptions = await normalizeOptionsAsync(tree, options);
  
  console.log(`Generating UiNav:`, normalizedOptions);

  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, { ...normalizedOptions, projectType: 'library' });
  const sectionRoot = nameAndRootOptions.projectRoot;

  await generateUiNavLibrary(tree, normalizedOptions);


  generateFiles(tree, path.join(__dirname, 'files'), sectionRoot, normalizedOptions);
  // await formatFiles(tree);
}

//##############################################//

export default sectionUiNavGenerator;

//##############################################//




// npx nx generate @nx/workspace:remove --projectName=sb-hub-blog-ui-nav --no-interactive 