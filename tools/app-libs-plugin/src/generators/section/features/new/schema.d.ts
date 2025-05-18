export interface SectionNewFeatureGeneratorSchema {
  name: string;
  directory?: string;
  sectionEntryPoint: string;
  sectionRouteDefs: string;
}

//##############################################//

export interface NoramlizedSectionNewFeatureGeneratorSchema extends SectionNewFeatureGeneratorSchema {
  className: string,
  classNamePrefix: string,
  propertyName: string,
  constantName: string,
  fileName: string,
  directory: string;
  libraryRoot: string;
  importPrefix:string;
  libraryNamePrefix: string;
  prefix: string;
  sectionClassNamePrefix: string;
  // applicationName: string;
}

