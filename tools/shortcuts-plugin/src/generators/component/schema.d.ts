export interface ComponentGeneratorSchema {
  name: string;
  directory?: string;
  prefix?:string
}


//##############################################//

export interface NoramlizedComponentGeneratorSchema extends ComponentGeneratorSchema {
  name: string,
  directory: string;
  prefix:string
}
