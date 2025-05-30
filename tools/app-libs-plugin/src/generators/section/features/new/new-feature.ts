import { libraryGenerator } from '@nx/angular/generators';
import { generateFiles, Tree } from '@nx/devkit';
import { GeneratorUtils, getDefaultLibraryOptions } from "@spider-baby/generators-utils";
import * as path from 'path';
import { EntryPointRoutesUtils } from '../../../@shared/utils/entry-point-routes-utils';
import { RouteDefsUtils } from '../../../@shared/utils/route-defs-utils';
import { NewFeatureOptionsUtils } from './options-utils';
import { NoramlizedSectionNewFeatureGeneratorSchema, SectionNewFeatureGeneratorSchema } from './schema';


//------------------------------//

function createImportStatement(options: NoramlizedSectionNewFeatureGeneratorSchema) {
  return `import { ${options.componentClassName} } from '${options.importPath}';`;
}

//------------------------------//

function updateEntryPointRoutes(tree: Tree, options: NoramlizedSectionNewFeatureGeneratorSchema) {

  console.log(`updateEntryPointRoutes called with`, options);

  const importStatement = createImportStatement(options);

  const routeElement = `
    {
      path: ${options.classNamePrefix}SectionRoutesDefs.route('${options.fileName}'),
      loadComponent: () => import('${options.importPath}')
        .then((m) => m.${options.componentClassName}),
    }
`

  // console.log(`routeElement`, routeElement);


 const updatedFileContent =  EntryPointRoutesUtils.findFileAndAddChildRoutes(tree, options.sectionEntryPoint, importStatement, routeElement);
 console.log(`updatedFileContent`, updatedFileContent);


}

//------------------------------//

function updateRouteDefs(tree: Tree, options: NoramlizedSectionNewFeatureGeneratorSchema) {

 const updatedFileContent = RouteDefsUtils.findFileAndAddChildRoute(tree, options.sectionRouteDefs, options.fileName);
 console.log(`updatedFileContent`, updatedFileContent);
 

}

//------------------------------//

async function generateNewFeatureLibrary(tree: Tree, options: NoramlizedSectionNewFeatureGeneratorSchema) {

  const directory = options.libraryRoot
  const libraryName = options.libraryName
  const importPath = options.importPath
  const defaultOptions = getDefaultLibraryOptions()


  const libOptions = {
    ...defaultOptions,
    ...options,
    directory,
    importPath,
    name: libraryName,
  }

  await libraryGenerator(tree, libOptions);


  // Clean up and edit
  GeneratorUtils.removeDefaultLibraryComponentFiles(tree, directory, libraryName);
  GeneratorUtils.addCustomEslintRules(tree, directory);

}

//------------------------------//

export async function newFeatureGenerator(tree: Tree, options: SectionNewFeatureGeneratorSchema) {

  const normalizedOptions = await NewFeatureOptionsUtils.normalizeOptionsAsync(tree, options)
  await generateNewFeatureLibrary(tree, normalizedOptions);

  const libraryRoot = normalizedOptions.libraryRoot;

  updateEntryPointRoutes(tree, normalizedOptions)
  updateRouteDefs(tree, normalizedOptions);

  generateFiles(tree, path.join(__dirname, 'files'), libraryRoot, normalizedOptions);
  // await formatFiles(tree);
}

//##############################################//

export default newFeatureGenerator;


//##############################################//