export interface SwgModelsGeneratorSchema {
 outputDir: string;
  swaggerPath?: string;
  swaggerUrl?: string;
}


//##############################################//

export interface NoramlizedSwgModelsGeneratorSchema extends SwgModelsGeneratorSchema {
  generateFromUrl: boolean;
}

