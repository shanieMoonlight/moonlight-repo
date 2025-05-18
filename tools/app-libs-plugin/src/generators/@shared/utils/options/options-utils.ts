import { names, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from '../../schema/schema';
import { PathUtils } from '../path-utils';


export class OptionsUtils {


  private static removeMultipleDashes(text: string) {
    return text.replace(/-+/g, '-');
  }

  //------------------------------//

  static async normalizeOptionsAsync(tree: Tree, options: SectionGeneratorSchema): Promise<NoramlizedSectionGeneratorSchema> {

    console.log('options', options);


    const name = options.name;
    const namesOptions = names(name);
    const directory = options.directory ?? name;
    const applicationName = options.importPrefix ?? options.application;
    const libraryNamePrefix = OptionsUtils.removeMultipleDashes(`${applicationName}-${name}`);

    const prefix = names(applicationName).fileName;
    const atImportPrefix = !prefix.startsWith('@') ? `@${prefix}` : prefix;
    const sectionImportSegment = `sections-${name}`;
    const importPrefix = PathUtils.combine(atImportPrefix, sectionImportSegment)

    const classNamePrefixNames = names(options.classNamePrefix ?? options.application);
    const classNamePrefix = classNamePrefixNames.className
    const sectionClassNamePrefix = `${classNamePrefixNames.className}${namesOptions.className}`

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

  // static getLibrarySettings(options: NoramlizedSectionGeneratorSchema, libName: string, path: string[] = []): LibrarySettings {

  //   const pathHyphenated = path
  //     .map((p) => p.trim())
  //     .filter((p) => p.length > 0)
  //     .join('-')

  //   const libNameFull = pathHyphenated.length > 0 ? `${libName}-${pathHyphenated}` : libName

  //   return {
  //     directory: PathUtils.combine(options.sectionRoot, ...path, `${libName}`),
  //     importPath: PathUtils.combine(options.importPrefix, libNameFull),
  //     libraryName: `${options.libraryNamePrefix}-${libNameFull}`
  //   }

  // }

  //------------------------------//


}//Cls