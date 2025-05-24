import { names, readProjectConfiguration, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { PathUtils } from '../../../@shared/utils/path-utils';
import { SectionNewFeatureGeneratorSchema, NoramlizedSectionNewFeatureGeneratorSchema } from './schema';
import { PackageJsonUtils } from '../../../@shared/utils/package-json-utils';
import { ProjectJsonUtils } from '../../../@shared/utils/project-json-utils';
import { ParentEntryPointLibUtils } from '../../../@shared/utils/entry-point-library-utils';
import { GeneratorUtils } from "@spider-baby/generators-utils";
import path = require('path');


export class NewFeatureOptionsUtils {



  static async normalizeOptionsAsync(tree: Tree, options: SectionNewFeatureGeneratorSchema): Promise<NoramlizedSectionNewFeatureGeneratorSchema> {


    const name = options.name;
    const namesOptions = names(name);

    const entryPointConfig = this.getParentLibraryConfig(tree, options.sectionEntryPoint);

    const libraryName = this.getLibName(tree, entryPointConfig, options);
    console.log(`libName`, libraryName);

    const importPath = this.getImportPath(tree, entryPointConfig, options);
    console.log(`importPath`, importPath);

    // const packageJsonPath = path.join(entryPointConfig.root, 'package.json');
    const componentClassName = this.getComponentClassName(tree, options, entryPointConfig);
    console.log(`componentClassName`, componentClassName);

    const classNamePrefix = this.getComponentClassNamePrefix(tree, entryPointConfig);


    const directory = namesOptions.fileName;

    const prefix = libraryName

    const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, {
      ...options,
      directory,
      projectType: 'library'
    })

    const libraryRoot = nameAndRootOptions.projectRoot;

    return {
      ...options,
      ...namesOptions,
      importPath,
      directory,
      prefix,
      libraryName,
      libraryRoot,
      classNamePrefix,
      componentClassName
    }

  }

  //------------------------------//

  static getLibName(tree: Tree, entryPointConfig: any, options: SectionNewFeatureGeneratorSchema) {
    const namesOptions = names(options.name);
    const libNamePrefix = this.getLibNamePrefix(tree, entryPointConfig);
    return this.removeMultipleDashes(`${libNamePrefix}-features-${namesOptions.fileName}`)
  }

  //------------------------------//

  static getLibNamePrefix(tree: Tree, entryPointConfig: any) {

    const entryPointLibName = ProjectJsonUtils.getProjectJsonNameProperty(tree, entryPointConfig);
    const entrPointSuffix = '-entry-point';

    if (!entryPointLibName.endsWith(entrPointSuffix))
      throw new Error(`Invalid entry point library name: ${entryPointLibName}`)

    const entrPointSuffixIndex = entryPointLibName.lastIndexOf(entrPointSuffix);
    // console.log(`Import prefix:`, importPrefix);
    return entryPointLibName.substring(0, entrPointSuffixIndex)

  }

  //------------------------------//

  static getImportPath(tree: Tree, entryPointConfig: any, options: SectionNewFeatureGeneratorSchema) {
    const importPrefix = this.getImportPrefix(tree, entryPointConfig);
    return PathUtils.combine(importPrefix, `features-${options.name}`);
  }

  //------------------------------//

  static getImportPrefix(tree: Tree, entryPointConfig: any) {

    const importPath = PackageJsonUtils.getPackageJsonNameProperty(tree, entryPointConfig);

    const segments = importPath.split('/')

    const lastSegment = segments.pop()
    if (lastSegment.toLowerCase() !== 'entry-point') {
      console.error('Invalid import path:', importPath)
    }

    const importPrefix = segments.join('/');
    // console.log(`Import prefix:`, importPrefix);
    return importPrefix;

  }

  //------------------------------//

  static getParentLibraryConfig(tree: Tree, libName: string) {
    return readProjectConfiguration(tree, libName)
  }

  //------------------------------//

  static getComponentClassName(tree: Tree, options: SectionNewFeatureGeneratorSchema, entryPointRoutesConfig: any) {
    const classNamePrefix = this.getComponentClassNamePrefix(tree, entryPointRoutesConfig);
    console.log(`classNamePrefix`, classNamePrefix);

    return `${classNamePrefix}${names(options.name).className}Component`

  }

  //------------------------------//

  static getComponentClassNamePrefix(tree: Tree, entryPointRoutesConfig: any) {
    const entryPointRoutesFilePath = this.getEntryPointRoutesFilesPath(tree, entryPointRoutesConfig);

    console.log(`getEntryPointComponent:`);
    // We need to extract the component class name prefix by removing the last "Component" suffix
    const entryPointComponentName = ParentEntryPointLibUtils.findEntryPointComponentName(tree, entryPointRoutesFilePath);
    if (!entryPointComponentName) {
      console.error('Could not find entry point component name');
      return '';
    }


    // Remove the last occurrence of "Component" from the name
    const lastComponentIndex = entryPointComponentName.lastIndexOf('Component');
    return lastComponentIndex !== -1
      ? entryPointComponentName.substring(0, lastComponentIndex)
      : entryPointComponentName
  }
  //------------------------------//

  private static getEntryPointRoutesFilesPath(tree: Tree, entryPointConfig: any) {
    console.log(`getEntryPointComponentFromRouteDefs:`);


    const entryPointDefsLibPath = path.join(entryPointConfig.sourceRoot, 'lib');

    // Find all route-defs.ts files in the directory
    const routeDefsFiles = GeneratorUtils.findFilesByPattern(tree, entryPointDefsLibPath, 'routes.ts');
    if (routeDefsFiles.length === 0) {
      console.error(`No route-defs.ts files found in ${entryPointDefsLibPath}`);
      return;
    }

    // Use the first matching file or choose based on some criteria
    return routeDefsFiles[0];
  }

  //------------------------------//

  private static removeMultipleDashes(text: string) {
    return text.replace(/-+/g, '-');
  }

  //------------------------------//


}//Cls