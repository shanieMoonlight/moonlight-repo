import { } from '@nx/angular';
import { libraryGenerator } from '@nx/angular/generators';
import { generateFiles, readProjectConfiguration, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { } from '@nx/js';
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from '../../@shared/schema/schema';
import { getDefaultOptions } from '../../@shared/utils/options/default-lib-options';
import { LibrarySettings } from '../../@shared/utils/options/lib-settings';
import { OptionsUtils } from '../../@shared/utils/options/options-utils';
import { PathUtils } from '../../@shared/utils/path-utils';
import { GeneratorUtils } from '../../@shared/utils/utility-functions';
import path = require('path');
import { ParentLibUtils } from '../../@shared/utils/parent-lib-utils';

//##############################################//


function getLibrarySettings(options: NoramlizedSectionGeneratorSchema): LibrarySettings {
  return {
    directory: PathUtils.combine(options.sectionRoot, '@route-defs'),
    importPath: PathUtils.combine(options.importPrefix, 'route-defs'),
    libraryName: options.libraryNamePrefix + '-route-defs'
  }
}


//------------------------------//


function addToClassObjectObject(tree: Tree, parentRouteDefsPathRelative: string, objectName: string, routesObjectProperty: string) {

  if (!tree.exists(parentRouteDefsPathRelative)) {
    console.error(`File not found: ${parentRouteDefsPathRelative}`);
    return;
  }

  if (!routesObjectProperty.endsWith(','))
    routesObjectProperty += ',';

  let updatedContent = ''
  const parentRouteDefsContent = tree.read(parentRouteDefsPathRelative, 'utf-8');

  // Find the routes object
  // const classObjectRegex = /static\s+routes\s*=\s*{([^}]*)}/s;

  const classObjectRegex = new RegExp(`static\\s+${objectName}\\s*=\\s*{([^}]*)}`, 's');
  const match = classObjectRegex.exec(parentRouteDefsContent);

  if (!match) {
    console.error(`Could not find static routes object in ${parentRouteDefsPathRelative}`);
  }

  const classObjectContent = match[1];
  const classObjectEndPos = match.index + match[0].indexOf('}');

  // Check if the route already exists
  const classObjectExistsRegex = new RegExp(`${routesObjectProperty}`);
  if (classObjectExistsRegex.test(classObjectContent)) {
    console.log(`Route '${routesObjectProperty}' already exists in routes object`);
    return;
  }

  // Create new route property
  const indentation = '    ';  // Match existing indentation

  // Insert the new route property before the closing curly brace
  updatedContent =
    parentRouteDefsContent.substring(0, classObjectEndPos) +
    `${indentation}${routesObjectProperty}
    ` +
    parentRouteDefsContent.substring(classObjectEndPos);

  // Write back to the file
  tree.write(parentRouteDefsPathRelative, updatedContent);
  console.log(`Added route '${routesObjectProperty}`)


  return updatedContent;
}


//------------------------------//


function updateParentRouteDefs(tree: Tree, options: NoramlizedSectionGeneratorSchema) {

  if (!options.parentRouteDefs)
    return;

  // Access the project by name
  try {

    const projectConfig = readProjectConfiguration(tree, options.parentRouteDefs);
    const parentRouteDefsLib = path.join(projectConfig.sourceRoot, 'lib');

    // Find all route-defs.ts files in the directory
    const routeDefsFiles = GeneratorUtils.findFilesByPattern(tree, parentRouteDefsLib, 'route-defs.ts');


    if (routeDefsFiles.length === 0) {
      console.error(`No route-defs.ts files found in ${parentRouteDefsLib}`);
      return;
    }

    // Use the first matching file or choose based on some criteria
    const parentRouteDefsPath = routeDefsFiles[0];
    console.log(`Found route-defs file: ${parentRouteDefsPath}`);


    if (!tree.exists(parentRouteDefsPath)) {
      console.error(`File ${parentRouteDefsPath} does not exist in the project`);
      return;
    }


    const importPath = PathUtils.combine(options.importPrefix, 'route-defs');
    const routeDefsClassName = `${options.sectionClassNamePrefix}SectionRoutesDefs`;
    const importStatement = `import { ${routeDefsClassName} } from '${importPath}';`;


    console.log(`Adding import statement:  ${importStatement}`);
    let updatedParentRouteDefsContent = ParentLibUtils.addImportToClass(tree, parentRouteDefsPath, importStatement);
    console.log(`Updated parent ${parentRouteDefsPath} content: `, updatedParentRouteDefsContent);


    const routesObjectProperty = `${options.name}: ${options.sectionClassNamePrefix}SectionRoutesDefs.routes,`;
    updatedParentRouteDefsContent = addToClassObjectObject(tree, parentRouteDefsPath, 'routes', routesObjectProperty);
    console.log(`Updated parent ${parentRouteDefsPath} content: `, updatedParentRouteDefsContent);


    const routesFullPathFnProperty = `${options.name}: ${options.sectionClassNamePrefix}SectionRoutesDefs.fullPathFn(this.BASE),`;
    updatedParentRouteDefsContent = addToClassObjectObject(tree, parentRouteDefsPath, 'fullPaths', routesFullPathFnProperty);
    console.log(`Updated parent ${parentRouteDefsPath} content: `, updatedParentRouteDefsContent);


  } catch (error) {
    console.error(`Project ${options.application} not found in the workspace`);
    throw error;
  }

}


//------------------------------//

async function generateRouteDefsLibrary(tree: Tree, options: NoramlizedSectionGeneratorSchema): Promise<LibrarySettings> {

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

  // Clean up and edit
  GeneratorUtils.removeDefaultLibraryComponentFiles(tree, librarySettings.directory, librarySettings.libraryName);
  GeneratorUtils.addCustomEslintRules(tree, librarySettings.directory);


  return librarySettings;

}

//------------------------------//

export async function sectionRouteDefsGenerator(tree: Tree, options: SectionGeneratorSchema) {

  const normalizedOptions = await OptionsUtils.normalizeOptionsAsync(tree, options);

  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, { ...normalizedOptions, projectType: 'library' });
  const sectionRoot = nameAndRootOptions.projectRoot;

  console.log(`Generating RouteDefs:`, normalizedOptions);

  const libSettings = await generateRouteDefsLibrary(tree, normalizedOptions);
  console.log(`RouteDefs library settings:`, libSettings);

  updateParentRouteDefs(tree, normalizedOptions);


  generateFiles(tree, path.join(__dirname, 'files'), sectionRoot, normalizedOptions);
  // await formatFiles(tree);
}

//##############################################//

export default sectionRouteDefsGenerator;

//##############################################//


// npx nx generate @nx/workspace:remove --projectName=sb-hub-blog-route-defs --no-interactive 

