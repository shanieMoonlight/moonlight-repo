import { } from '@nx/angular';
import { libraryGenerator } from '@nx/angular/generators';
import { generateFiles, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { } from '@nx/js';
import { GeneratorUtils, getDefaultLibraryOptions } from "@spider-baby/generators-utils";
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from '../../@shared/schema/schema';
import { EntryPointRoutesUtils } from '../../@shared/utils/entry-point-routes-utils';
import { LibrarySettings } from '../../@shared/utils/options/lib-settings';
import { OptionsUtils } from '../../@shared/utils/options/options-utils';
import { PathUtils } from '../../@shared/utils/path-utils';
import path = require('path');

//##############################################//


function getLibrarySettings(options: NoramlizedSectionGeneratorSchema): LibrarySettings {
  return {
    directory: PathUtils.combine(options.sectionRoot, '@entry-point'),
    importPath: PathUtils.combine(options.importPrefix, 'entry-point'),
    libraryName: options.libraryNamePrefix + '-entry-point'
  }
}

//------------------------------//

function updateParentEntryPointRoutes(tree: Tree, options: NoramlizedSectionGeneratorSchema) {

  const parentEntryPoint = options.parentEntryPoint;
  if (!parentEntryPoint)
    return;

  const importPath = PathUtils.combine(options.importPrefix, 'entry-point');
  const routeDefsClassName = `${options.sectionClassNamePrefix}Routes`;
  const importStatement = `import { ${routeDefsClassName} } from '${importPath}';`;


  const routesArrayElement = `...${options.sectionClassNamePrefix}Routes(),`;

  const updatedContent = EntryPointRoutesUtils.findFileAddToRoutesArray(tree, parentEntryPoint, importStatement, routesArrayElement);

  console.log(`updatedContent:`, updatedContent);

}


//------------------------------//

async function generateEntryPointLibrary(tree: Tree, options: NoramlizedSectionGeneratorSchema): Promise<LibrarySettings> {

  const librarySettings = getLibrarySettings(options);
  const defaultOptions = getDefaultLibraryOptions()

  const libOptions = {
    ...defaultOptions,
    ...options,
    directory: librarySettings.directory,
    importPath: librarySettings.importPath,
    name: librarySettings.libraryName,
  }

  await libraryGenerator(tree, libOptions);


  // Clean up unwanted component files
  GeneratorUtils.removeDefaultLibraryComponentFiles(tree, librarySettings.directory, librarySettings.libraryName);
  GeneratorUtils.addCustomEslintRules(tree, librarySettings.directory);



  return librarySettings;
}

//------------------------------//

export async function sectionEntryPointGenerator(tree: Tree, options: SectionGeneratorSchema) {

  const normalizedOptions = await OptionsUtils.normalizeOptionsAsync(tree, options);

  console.log(`Generating EntryPoint:`, normalizedOptions);

  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, { ...normalizedOptions, projectType: 'library' });
  const sectionRoot = nameAndRootOptions.projectRoot;

  const libSettings = await generateEntryPointLibrary(tree, normalizedOptions);
  console.log(`EntryPoint library settings:`, libSettings);

  updateParentEntryPointRoutes(tree, normalizedOptions);

  generateFiles(tree, path.join(__dirname, 'files'), sectionRoot, normalizedOptions);


  // await formatFiles(tree);
}

//##############################################//

export {
  generateEntryPointLibrary, getLibrarySettings,
  updateParentEntryPointRoutes
};

export default sectionEntryPointGenerator;

//##############################################//



