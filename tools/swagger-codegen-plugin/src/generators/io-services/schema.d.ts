export interface IoServicesGeneratorSchema {
 outputDir: string;
  swaggerPath?: string;
  swaggerUrl?: string;
}


//##############################################//

export interface NoramlizedIoServicesGeneratorSchema extends IoServicesGeneratorSchema {
  generateFromUrl: boolean;
}

