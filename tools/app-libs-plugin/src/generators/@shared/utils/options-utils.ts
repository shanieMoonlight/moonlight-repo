import { names, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { SectionGeneratorSchema, NoramlizedSectionGeneratorSchema } from '../schema/schema';
import { PathUtils } from './path-utils';

function removeMultipleDashes(text:string){
  return text.replace(/-+/g, '-');
}

//------------------------------//

export async function normalizeOptionsAsync(tree: Tree, options: SectionGeneratorSchema): Promise<NoramlizedSectionGeneratorSchema> {

  console.log('options', options);
  

  const name = options.name;
  const namesOptions = names(name);
  const directory = options.directory ?? name;
  const applicationName = options.importPrefix ?? options.application;
  const libraryNamePrefix = removeMultipleDashes(`${applicationName}-${name}`);

  const prefix = names(applicationName).fileName;
  const atImportPrefix = `@${prefix}`;
  const sectionImportSegment = `sections-${name}`;
  const importPrefix = PathUtils.combine(atImportPrefix, sectionImportSegment)
  
  const classNamePrefixNames = names(options.classNamePrefix ?? options.application);
  const classNamePrefix = classNamePrefixNames.className
  const sectionClassNamePrefix =  `${classNamePrefixNames.className}${namesOptions.className}`

  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, {
    ...options,
    directory,
    projectType: 'library'
  })

  const sectionRoot = nameAndRootOptions.projectRoot;

  return {
    ...options,
    ...namesOptions,
    sectionRoot,
    directory,
    prefix,
    importPrefix,
    classNamePrefix,
    libraryNamePrefix,
    sectionClassNamePrefix
  }

}

//------------------------------//