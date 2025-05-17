import { names, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { SectionGeneratorSchema, NoramlizedSectionGeneratorSchema } from '../schema/schema';




export async function normalizeOptionsAsync(tree: Tree, options: SectionGeneratorSchema): Promise<NoramlizedSectionGeneratorSchema> {

  console.log(`options:`, options);


  const name = options.name;
  const directory = options.directory ?? name;
  const applicationName = options.importPrefix ?? options.application;
  const libraryNamePrefix = `${applicationName}-${name}`.replace(/-+/g, '-');
  const prefix = names(applicationName).fileName;
  const importPrefix = '@' + prefix;
  const classNamePrefixNames = names(options.classNamePrefix ?? options.application);
  const classNamePrefix = classNamePrefixNames.className

  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, {
    ...options,
    directory,
    projectType: 'library'
  })

  const sectionRoot = nameAndRootOptions.projectRoot;

  console.log(`names(name): `, names(name));
  console.log(`classNamePrefix: `, classNamePrefix);
  console.log(`names(applicationName): `, names(applicationName));

  return {
    ...options,
    ...names(name),
    sectionRoot,
    directory,
    prefix,
    importPrefix,
    classNamePrefix,
    libraryNamePrefix
  }

}