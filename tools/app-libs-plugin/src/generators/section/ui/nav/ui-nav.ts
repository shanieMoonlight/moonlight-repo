import { } from '@nx/angular';
import { libraryGenerator as ngLibGenerator } from '@nx/angular/generators';
import { generateFiles, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { } from '@nx/js';
import { GeneratorUtils, getDefaultLibraryOptions } from "@spider-baby/generators-utils";
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from '../../../@shared/schema/schema';
import { OptionsUtils } from '../../../@shared/utils/options/options-utils';
import { PathUtils } from '../../../@shared/utils/path-utils';
import path = require('path');

//##############################################//

async function generateUiNavLibrary(tree: Tree, options: NoramlizedSectionGeneratorSchema) {

  const directory = PathUtils.combine(options.sectionRoot, 'ui', 'nav')
  const importPath = PathUtils.combine(options.importPrefix, 'ui-nav')
  const libraryName = options.libraryNamePrefix + '-ui-nav'
  const defaultOptions = getDefaultLibraryOptions()

  const libOptions = {
    ...defaultOptions,
    ...options,
    directory,
    importPath,
    name: libraryName,
  }

  await ngLibGenerator(tree, libOptions);


  // Clean up and edit
  GeneratorUtils.removeDefaultLibraryComponentFiles(tree, directory, libraryName);
  GeneratorUtils.addCustomEslintRules(tree, directory);

}

//------------------------------//

export async function sectionUiNavGenerator(tree: Tree, options: SectionGeneratorSchema) {

  const normalizedOptions = await OptionsUtils.normalizeOptionsAsync(tree, options);

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