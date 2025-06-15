import {
  formatFiles,
  generateFiles,
  Tree
} from '@nx/devkit';
import { generateInterfacesFromPath, generateInterfacesFromUrlAsync } from '@spider-baby/generators-swagger-io-codegen';
import * as path from 'path';
import { NoramlizedSwgModelsGeneratorSchema, SwgModelsGeneratorSchema } from './schema';


function normalizeOptions(tree: Tree, options: SwgModelsGeneratorSchema): NoramlizedSwgModelsGeneratorSchema {

  return {
    ...options,
    generateFromUrl: !!options.swaggerUrl,
  }

}

//-----------------------------//

export async function swgModelsGenerator(
  tree: Tree,
  options: SwgModelsGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);

  if (!options.outputDir) 
    throw new Error('outputDir is required')

  
  const projectRoot = `libs/${normalizedOptions.outputDir}`;

  console.log('tree', tree);
  console.log('options', options, __dirname);
  
  
  if (options.swaggerUrl) {
    await generateInterfacesFromUrlAsync(tree, options.swaggerUrl, options.outputDir);
  } else if (options.swaggerPath) {
    generateInterfacesFromPath(tree, options.swaggerPath, options.outputDir);
  } else {
    throw new Error('Either swaggerUrl or swaggerPath must be provided');
  }


  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, normalizedOptions);
  await formatFiles(tree);
}

export default swgModelsGenerator;
