export interface LibraryGeneratorGeneratorSchema {
  name: string;
  directory?: string;
  importPath:string;
  componentName?: string,
  prefix?: string;
}

//##############################################//

export interface NoramlizedLibraryGeneratorGeneratorSchema extends LibraryGeneratorGeneratorSchema {
  componentClassName: string,
  componentFileName: string,
  componentSelector: string,
  directory: string;
  prefix: string;
}

