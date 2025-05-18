import { } from '@nx/angular';
import { libraryGenerator as ngLibGenerator } from '@nx/angular/generators';
import { generateFiles, readProjectConfiguration, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { } from '@nx/js';
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from '../../@shared/schema/schema';
// import { getDefaultOptions } from '../../@shared/utils/default-lib-options';
// import { normalizeOptionsAsync } from '../../@shared/utils/options-utils';
import { PathUtils } from '../../@shared/utils/path-utils';
import { GeneratorUtils } from '../../@shared/utils/utility-functions';
import path = require('path');
import { getDefaultOptions } from '../../@shared/utils/options/default-lib-options';
import { OptionsUtils } from '../../@shared/utils/options/options-utils';
import { ParentLibUtils } from '../../@shared/utils/parent-lib-utils';
import { LibrarySettings } from '../../@shared/utils/options/lib-settings';

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
    const parentEntryPointLib = path.join(projectConfig.sourceRoot, 'lib', 'routes');
    console.log(`Parent entry-point library path: ${parentEntryPointLib}`);
    

    // Find all entry-point.ts files in the directory
    const routeDefsFiles = GeneratorUtils.findFilesByPattern(tree, parentEntryPointLib, 'routes.ts');


    if (routeDefsFiles.length === 0) {
      console.error(`No route.ts files found in ${parentEntryPointLib}`);
      return;
    }

    // Use the first matching file or choose based on some criteria
    const parentEntryPointPath = routeDefsFiles[0];
    console.log(`Found routes file: ${parentEntryPointPath}`);


    if (!tree.exists(parentEntryPointPath)) {
      console.error(`File ${parentEntryPointPath} does not exist in the project`);
      return;
    }


    const importPath = PathUtils.combine(options.importPrefix, 'entry-point');
    const routeDefsClassName = `${options.sectionClassNamePrefix}Routes`;
    const importStatement = `import { ${routeDefsClassName} } from '${importPath}';`;


    console.log(`Adding import statement:  ${importStatement}`);
    const updatedParentEntryPointContent = ParentLibUtils.addImportToClass(tree, parentEntryPointPath, importStatement);
    console.log(`Updated parent ${parentEntryPointPath} content: `, updatedParentEntryPointContent);


    // const routesObjectProperty = `${options.name}: ${options.sectionClassNamePrefix}SectionRoutesDefs.routes,`;
    // updatedParentEntryPointContent = addToClassObjectObject(tree, parentEntryPointPath, 'routes', routesObjectProperty);
    // console.log(`Updated parent ${parentEntryPointPath} content: `, updatedParentEntryPointContent);


    // const routesFullPathFnProperty = `${options.name}: ${options.sectionClassNamePrefix}SectionRoutesDefs.fullPathFn(this.BASE),`;
    // updatedParentEntryPointContent = addToClassObjectObject(tree, parentEntryPointPath, 'fullPaths', routesFullPathFnProperty);
    // console.log(`Updated parent ${parentEntryPointPath} content: `, updatedParentEntryPointContent);


  } catch (error) {
    console.error(`Project ${options.application} not found in the workspace`);
    throw error;
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

  await ngLibGenerator(tree, libOptions);


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

export default sectionEntryPointGenerator;

//##############################################//



