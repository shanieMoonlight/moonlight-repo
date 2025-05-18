

export interface SectionGeneratorSchema {
  name: string;
  directory?: string;
  application: string;
  classNamePrefix: string;
  importPrefix?: string;

}

//##############################################//

export interface NoramlizedSectionGeneratorSchema extends SectionGeneratorSchema {
  className: string,
  classNamePrefix: string,
  propertyName: string,
  constantName: string,
  fileName: string,
  directory: string;
  sectionRoot: string;
  importPrefix:string;
  libraryNamePrefix: string;
  prefix: string;
  sectionClassNamePrefix: string;
  // applicationName: string;
}

