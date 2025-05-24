import { } from '@nx/angular';
import { libraryGenerator, librarySecondaryEntryPointGenerator } from '@nx/angular/generators';
import { generateFiles, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from '../../@shared/schema/schema';

import { PathUtils } from '../../@shared/utils/path-utils';
import { GeneratorUtils, getDefaultLibraryOptions } from "@spider-baby/generators-utils";
import path = require('path');
import { OptionsUtils } from '../../@shared/utils/options/options-utils';

//##############################################//

async function generateConfigLibrary(tree: Tree, options: NoramlizedSectionGeneratorSchema) {

  const directory =  PathUtils.combine(options.sectionRoot, 'config')
  const importPath = PathUtils.combine(options.importPrefix, 'config')
  const libraryName = `${options.libraryNamePrefix}-config`
  const defaultOptions = getDefaultLibraryOptions()

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
  await librarySecondaryEntryPointGenerator(tree, {
    library: libraryName,
    name: 'route-data',
    skipModule: true,
    skipFormat: true
  })

  // Clean up and edit
console.log(`Cleaning up and editing library files...`, directory, libraryName);

GeneratorUtils.removeDefaultLibraryComponentFiles(tree, directory, libraryName);
GeneratorUtils.addCustomEslintRules(tree, directory);

}

//------------------------------//

export async function sectionConfigGenerator(tree: Tree, options: SectionGeneratorSchema) {

  const normalizedOptions = await OptionsUtils.normalizeOptionsAsync(tree, options);

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