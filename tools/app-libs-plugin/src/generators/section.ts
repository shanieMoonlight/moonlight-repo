import { } from '@nx/angular';
import { addProjectConfiguration, formatFiles, generateFiles, names, Tree, } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { } from '@nx/js';
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from './schema';
import { libraryGenerator as ngLibGenerator } from '@nx/angular/generators';
// import { libraryGenerator as jsLibGenerator } from '@nx/js';
import { getDefaultOptions } from './utils/default-lib-options';
import { PathUtils } from './utils/path-utils';
import path = require('path');

//##############################################//

async function normalizeOptionsAsync(tree: Tree, options: SectionGeneratorSchema): Promise<NoramlizedSectionGeneratorSchema> {

console.log(`options:`, options);


  const name = options.name;
  const directory = options.directory ?? name;
  const applicationName = options.applicationName ?? options.application;
  const prefix = names(applicationName).fileName;
  const baseImportPath = '@' + prefix;
  const applicationNameShortNames = names(options.applicationNameShort ?? options.application);
  const classNamePrefix = applicationNameShortNames.className

  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, {
    ...options,
    directory,
    projectType: 'library'
  })

  const sectionRoot = nameAndRootOptions.projectRoot;

  console.log(`names(name): `, names(name));
  console.log(`classNamePrefix: `,classNamePrefix);
  console.log(`names(applicationName): `, names(applicationName));

  return {
    ...options,
    ...names(name),
    sectionRoot,
    directory,
    prefix,
    baseImportPath, 
    classNamePrefix
  }

}

//------------------------------//

async function generateEntryPointLibrary(tree: Tree, options: NoramlizedSectionGeneratorSchema) {

  const directory = PathUtils.combine(options.sectionRoot, '@entry-point')
  const importPath = PathUtils.combine(options.baseImportPath, 'entry-point')
  const entryPointLibName = options.application +'-entry-point'
  const defaultOptions = getDefaultOptions()

  const entryPointLibOptions = {
    ...defaultOptions,
    ...options,
    directory,
    importPath,
    name: entryPointLibName,
  }

  await ngLibGenerator(tree, entryPointLibOptions);

}

//------------------------------//

export async function sectionGenerator(tree: Tree, options: SectionGeneratorSchema) {

  const normalizedOptions = await normalizeOptionsAsync(tree, options);
  console.log(`normalizedOptions:`, normalizedOptions);

  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, { ...normalizedOptions, projectType: 'library' });
  const sectionRoot = nameAndRootOptions.projectRoot;

  await generateEntryPointLibrary(tree, normalizedOptions);


  generateFiles(tree, path.join(__dirname, 'files'), sectionRoot, normalizedOptions);
  // await formatFiles(tree);
}

//##############################################//

export default sectionGenerator;

//##############################################//