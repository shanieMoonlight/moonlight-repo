export interface DemoAppGeneratorSchema {
  name: string;
  directory?: string; 
  displayName?: string;
  prefix: string;
  port: number;
}


//#######################################//

export interface NoramlizedDemoAppGeneratorSchema extends DemoAppGeneratorSchema {
  displayName: string;
  displayNameShort: string;
  directory: string; 
}