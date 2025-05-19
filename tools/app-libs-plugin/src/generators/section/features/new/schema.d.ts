export interface SectionNewFeatureGeneratorSchema {
  name: string;
  directory?: string;
  sectionEntryPoint: string;
  sectionRouteDefs: string;
}

//##############################################//

export interface NoramlizedSectionNewFeatureGeneratorSchema extends SectionNewFeatureGeneratorSchema {
  className: string,
  // classNamePrefix: string,
  propertyName: string,
  constantName: string,
  fileName: string,
  directory: string;
  libraryRoot: string;
  libraryName: string;
  importPath:string;
  // libraryNamePrefix: string;
  prefix: string;
  // sectionClassNamePrefix: string;
  componentClassName: string;
  // applicationName: string;
}

