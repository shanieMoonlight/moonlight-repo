import { libraryGenerator } from '@nx/angular/generators';
import { Schema } from '@nx/angular/src/generators/library/schema';
import { formatFiles, generateFiles, names, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { GeneratorUtils, getDefaultLibraryOptions } from "@spider-baby/generators-utils";
import * as path from 'path';
import { LibraryGeneratorGeneratorSchema, NoramlizedLibraryGeneratorGeneratorSchema } from './schema';

//----------------------------//

function sanitizeCompnentName(componentName?: string): string {
  if (!componentName)
    return ''
  // Remove 'component' (case-insensitive, global)
  const result = componentName.replace(/component/gi, '');

  // Trim non-alphanumeric characters from the start and end of the string.
  // This regex matches:
  // ^[^a-zA-Z0-9]+ : one or more non-alphanumeric characters at the beginning
  // |                : OR
  // [^a-zA-Z0-9]+$ : one or more non-alphanumeric characters at the end
  // The 'g' flag ensures that if the string consists only of non-alphanumeric characters,
  // it will be entirely replaced by an empty string.
  return result.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');

}

//----------------------------//

function normalizeOptions(options: LibraryGeneratorGeneratorSchema): NoramlizedLibraryGeneratorGeneratorSchema {

  const sanitizedComponentName = sanitizeCompnentName(options.componentName);
  const componentNameOptions = names(sanitizedComponentName);

  const prefix = options.prefix || 'sb';
  const prefixOptions = names(prefix);
  const componentFileName = componentNameOptions.fileName.replace(`${prefix}-`, ''); //Don't use the prefix in the file name
  console.log(`componentNameOptions.fileName:`, componentNameOptions.fileName);
  console.log(`componentFileName:`, componentFileName);
  
  
  const selectorSuffix =`${prefix}-${componentFileName}`;

  const componentClassName = `${prefixOptions.className}${componentNameOptions.className}Component`;


  return {
    ...options,
    name: options.name,
    directory: options.directory || options.name,
    importPath: options.importPath || `@spider-baby/${options.name}`,
    componentClassName: componentClassName,
    componentFileName: componentFileName,
    componentName: sanitizedComponentName,
    prefix: prefix,
    componentSelector: `${selectorSuffix}`,
  }

}


//----------------------------//

function getLibraryOptions(options: NoramlizedLibraryGeneratorGeneratorSchema): Schema {

  const defaultOptions = getDefaultLibraryOptions()
  return {
    ...defaultOptions,
    ...options,
    name: options.name,
    importPath: options.importPath,
    prefix: options.prefix,
  };

}

//----------------------------//

export async function libraryGeneratorGenerator(
  tree: Tree,
  options: LibraryGeneratorGeneratorSchema
) {  
  
  const normalizedOptions = normalizeOptions(options)
  const libraryOptions = getLibraryOptions(normalizedOptions);
  
  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, { ...normalizedOptions, projectType: 'library' });
  const projectRoot = nameAndRootOptions.projectRoot;
  const libraryName = normalizedOptions.name;
  

  await libraryGenerator(tree, libraryOptions);
  if (options.componentName) {
    generateFiles(tree, path.join(__dirname, 'files'), projectRoot, normalizedOptions);
    await formatFiles(tree);
  }
  
  GeneratorUtils.removeDefaultLibraryComponentFiles(tree, projectRoot, libraryName);
  GeneratorUtils.addCustomEslintRules(tree, projectRoot)

}

//##############################################//

export default libraryGeneratorGenerator;

//##############################################//