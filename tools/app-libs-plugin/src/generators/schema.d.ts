

export interface SectionGeneratorSchema {
  name: string;
  directory?: string;
  application: string;
  applicationNameShort: string;
  applicationName?: string;

}

//##############################################//

export interface NoramlizedSectionGeneratorSchema extends SectionGeneratorSchema {
  className: string,
  classNamePrefix: string,
  baseImportPath: string,
  propertyName: string,
  constantName: string,
  fileName: string,
  directory: string;
  sectionRoot: string;
  prefix: string;
  // applicationName: string;
}

