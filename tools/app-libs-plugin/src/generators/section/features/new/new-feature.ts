import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/angular/generators';
import * as path from 'path';
import { NoramlizedSectionNewFeatureGeneratorSchema, SectionNewFeatureGeneratorSchema } from './schema';
import { PathUtils } from '../../../@shared/utils/path-utils';
import { getDefaultOptions } from '../../../@shared/utils/options/default-lib-options';
import { GeneratorUtils } from '../../../@shared/utils/generator-utils';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { PackageJsonUtils } from '../../../@shared/utils/package-json-utils';


//------------------------------//

// async function normalizeOptionsAsync(tree: Tree, options: SectionNewFeatureGeneratorSchema): Promise<NoramlizedSectionNewFeatureGeneratorSchema> {

//   console.log('options', options);


//   const name = options.name;
//   const namesOptions = names(name);
//   const directory = options.directory ?? name;
//   const applicationName = options.importPrefix ?? options.application;
//   const libraryNamePrefix = OptionsUtils.removeMultipleDashes(`${applicationName}-${name}`);

//   const prefix = names(applicationName).fileName;
//   const atImportPrefix = !prefix.startsWith('@') ? `@${prefix}` : prefix;
//   const sectionImportSegment = `sections-${name}`;
//   const importPrefix = PathUtils.combine(atImportPrefix, sectionImportSegment)

//   const classNamePrefixNames = names(options.classNamePrefix ?? options.application);
//   const classNamePrefix = classNamePrefixNames.className
//   const sectionClassNamePrefix = `${classNamePrefixNames.className}${namesOptions.className}`

//   const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, {
//     ...options,
//     directory,
//     projectType: 'library'
//   })

//   const sectionRoot = nameAndRootOptions.projectRoot;

//   return {
//     ...options,
//     ...namesOptions,
//     sectionRoot,
//     directory,
//     prefix,
//     importPrefix,
//     classNamePrefix,
//     libraryNamePrefix,
//     sectionClassNamePrefix
//   }

// }


async function generateNewFeatureLibrary(tree: Tree, options: NoramlizedSectionNewFeatureGeneratorSchema) {

  const directory = PathUtils.combine(options.libraryRoot, 'features', 'home')
  const importPath = PathUtils.combine(options.importPrefix, 'features-home')
  const libraryName = options.libraryNamePrefix + '-features-home'
  const defaultOptions = getDefaultOptions()


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

function getParentLibraryConfig(tree: Tree, libName: string) {
  return readProjectConfiguration(tree, libName)
}

//------------------------------//

function getImportPrefix(tree: Tree, parentEntryPointConfig: any) {

  const importPath = PackageJsonUtils.getPackageJsonNameProperty(tree, parentEntryPointConfig);

  const segments = importPath.split('/')

  const lastSegment = segments.pop()
  if (lastSegment.toLowerCase() !== 'entry-point') {
    console.error('Invalid import path:', importPath)
  }

  const importPrefix = segments.join('/');
  console.log(`Import prefix:`, importPrefix);
  return importPrefix;

}


//------------------------------//

function getImportPath(tree: Tree, parentEntryPointConfig: any, options: SectionNewFeatureGeneratorSchema) {

  const importPrefix = getImportPrefix(tree, parentEntryPointConfig);
  return PathUtils.combine(importPrefix, `features-${options.name}`);

}


//------------------------------//

export async function newFeatureGenerator(tree: Tree, options: SectionNewFeatureGeneratorSchema) {
  const projectRoot = `libs/${options.name}`;
  // addProjectConfiguration(tree, options.name, {
  //   root: projectRoot,
  //   projectType: 'library',
  //   sourceRoot: `${projectRoot}/src`,
  //   targets: {},
  // });

  const entryPointConfig = getParentLibraryConfig(tree, options.sectionEntryPoint);
  const routeDefsConfig = getParentLibraryConfig(tree, options.sectionRouteDefs);
  const importPath = getImportPath(tree, entryPointConfig, options);
  console.log(`routeDefsConfig library settings:`, routeDefsConfig);
  console.log(`importPath:`, importPath);



  // generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  // await formatFiles(tree);
}

//##############################################//

export default newFeatureGenerator;


//##############################################//