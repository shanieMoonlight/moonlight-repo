import { } from '@nx/angular';
import { libraryGenerator } from '@nx/angular/generators';
import { generateFiles, readProjectConfiguration, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { } from '@nx/js';
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from '../../@shared/schema/schema';
// import { getDefaultOptions } from '../../@shared/utils/default-lib-options';
// import { normalizeOptionsAsync } from '../../@shared/utils/options-utils';
import { PathUtils } from '../../@shared/utils/path-utils';
import { GeneratorUtils } from '../../@shared/utils/generator-utils';
import path = require('path');
import { getDefaultOptions } from '../../@shared/utils/options/default-lib-options';
import { OptionsUtils } from '../../@shared/utils/options/options-utils';
import { ClassImportUtils } from '../../@shared/utils/class-import-utils';
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

function addToRoutesArray(tree: Tree, routeDefsPathRelative: string, element: string) {

  console.log('addToRoutesArray called with ', routeDefsPathRelative, element);


  if (!tree.exists(routeDefsPathRelative)) {
    console.error(`File not found: ${routeDefsPathRelative}`);
    return;
  }

  if (!element.endsWith(','))
    element += ',';


  let updatedContent: string = undefined;
  const parentRouteDefsContent = tree.read(routeDefsPathRelative, 'utf-8');

  // Find the routes array definition
  // const routesArrayRegex = /export\s+const\s+\w+Routes\s*:\s*Route\[\]\s*=\s*\[([^]*?)\];/s;
  const routesArrayRegex = /export\s+const\s+\w+Routes\s*:\s*Route\[\]\s*=\s*\[([\s\S]*?)\];/;
  const routesMatch = routesArrayRegex.exec(parentRouteDefsContent);

  if (!routesMatch) {
    console.error(`Could not find routes array in ${routeDefsPathRelative}`);
    return ''
  }

  // Calculate the start position of the array content
  const arrayStartPos = routesMatch.index + routesMatch[0].indexOf('[') + 1;

  // Find the first object literal in the routes array (not a spread)
  // const firstObjectRegex = /\s*{[^}]*path\s*:/s;
  const firstObjectRegex = /\s*{[\s\S]*?path\s*:/;
  const objectMatch = firstObjectRegex.exec(routesMatch[1])


  if (!objectMatch) {
    console.error(`Could not find any route objects in the routes array`);
    return '';
  }

  console.log(`Found first object: ${objectMatch[0]}`);


  // Find the position of the first '{'
  const openBracePosition = objectMatch[0].indexOf('{');
  if (openBracePosition === -1) {
    console.error(`Could not find opening brace in object match`);
    return '';
  }

  // Insert our element before the first object (after all spreads)
  // The absolute position is array start + relative position of the object
  const insertPos = arrayStartPos + objectMatch.index + openBracePosition + 1;

  // Extract the indentation from the existing object
  const indentationMatch = /\n(\s*)/.exec(objectMatch[0]);
  const indentation = indentationMatch ? indentationMatch[1] : '  ';

  updatedContent =
    parentRouteDefsContent.substring(0, insertPos) +
    `\n${indentation}${element}\n` +
    parentRouteDefsContent.substring(insertPos);


  // Write the updated content back to the file
  tree.write(routeDefsPathRelative, updatedContent);
  console.log(`Added '${element}' to routes array in ${routeDefsPathRelative}`);

  return updatedContent;
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
    updatedParentEntryPointRoutesContent = addToRoutesArray(tree, routesFilesPath, routesArrayElement);
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
  addToRoutesArray,
  updateParentEntryPointRoutes,
  generateEntryPointLibrary
};

export default sectionEntryPointGenerator;

//##############################################//



