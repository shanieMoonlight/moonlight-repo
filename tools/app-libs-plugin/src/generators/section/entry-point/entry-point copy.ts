import { } from '@nx/angular';
import { libraryGenerator } from '@nx/angular/generators';
import { generateFiles, readProjectConfiguration, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { } from '@nx/js';
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from '../../@shared/schema/schema';
import { PathUtils } from '../../@shared/utils/path-utils';
import { GeneratorUtils } from '../../@shared/utils/generator-utils';
import path = require('path');
import { getDefaultOptions } from '../../@shared/utils/options/default-lib-options';
import { OptionsUtils } from '../../@shared/utils/options/options-utils';
import { ClassImportUtils } from '../../@shared/utils/class-import-utils';
import { LibrarySettings } from '../../@shared/utils/options/lib-settings';
import { EntryPointRoutesUtils } from '../../@shared/utils/entry-point-routes-utils';

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

  // Access the project by name
  try {

    const projectConfig = readProjectConfiguration(tree, parentEntryPoint);
    const parentEntryPointRoutesPath = path.join(projectConfig.sourceRoot, 'lib', 'routes');
    console.log(`Parent entry-point library path: ${parentEntryPointRoutesPath}`);


    // Find all entry-point.ts files in the directory
    const routesFiles = GeneratorUtils.findFilesByPattern(tree, parentEntryPointRoutesPath, 'routes.ts');


    if (routesFiles.length === 0) {
      console.error(`No route.ts files found in ${parentEntryPointRoutesPath}`);
      return;
    }

    // Use the first matching file or choose based on some criteria
    const routesFilesPath = routesFiles[0];
    console.log(`Found routes file: ${routesFilesPath}`);


    if (!tree.exists(routesFilesPath)) {
      console.error(`File ${routesFilesPath} does not exist in the project`);
      return;
    }


    const importPath = PathUtils.combine(options.importPrefix, 'entry-point');
    const routeDefsClassName = `${options.sectionClassNamePrefix}Routes`;
    const importStatement = `import { ${routeDefsClassName} } from '${importPath}';`;


    console.log(`Adding import statement:  ${importStatement}`)


    let updatedParentEntryPointRoutesContent = ClassImportUtils.addImportToClass(tree, routesFilesPath, importStatement);
    console.log(`Updated parent ${routesFilesPath} content: `, updatedParentEntryPointRoutesContent);


    const routesArrayElement = `...${options.sectionClassNamePrefix}Routes(),`;
    updatedParentEntryPointRoutesContent = EntryPointRoutesUtils.addToRoutesArray(tree, routesFilesPath, routesArrayElement);
    console.log(`*Updated parent ${routesFilesPath} content: `, updatedParentEntryPointRoutesContent);
   


  } catch (error) {

    console.error(`Project ${options.application} not found in the workspace`);
    throw error

  }

}


//------------------------------//

async function generateEntryPointLibrary(tree: Tree, options: NoramlizedSectionGeneratorSchema): Promise<LibrarySettings> {

  const librarySettings = getLibrarySettings(options);
  const defaultOptions = getDefaultOptions()

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
  getLibrarySettings,
  updateParentEntryPointRoutes,
  generateEntryPointLibrary
};

export default sectionEntryPointGenerator;

//##############################################//



