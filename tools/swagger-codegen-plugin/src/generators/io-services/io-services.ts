import {
  formatFiles,
  generateFiles,
  Tree
} from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { generateAllSwaggerIoFromPath, generateAllSwaggerIoFromUrl } from '@spider-baby/generators-swagger-io-codegen';
import * as path from 'path';
import { IoServicesGeneratorSchema, NoramlizedIoServicesGeneratorSchema } from './schema';

function normalizeOptions(tree: Tree, options: IoServicesGeneratorSchema): NoramlizedIoServicesGeneratorSchema {

  return {
    ...options,
    generateFromUrl: !!options.swaggerUrl,
  }

}

//-----------------------------//


export async function ioServicesGenerator(
  tree: Tree,
  options: IoServicesGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);

  if (!options.outputDir)
    throw new Error('outputDir is required')

  const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, { directory: options.outputDir, projectType: 'library' });
  const projectRoot = nameAndRootOptions.projectRoot;
  
  if (options.swaggerUrl) 
    await generateAllSwaggerIoFromUrl(tree, options.swaggerUrl, projectRoot);
   else if (options.swaggerPath) 
    generateAllSwaggerIoFromPath(tree, options.swaggerPath, projectRoot);
   else 
    throw new Error('Either swaggerUrl or swaggerPath must be provided');


  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, normalizedOptions);
  await formatFiles(tree);

  console.log(`Generated IO services in ${projectRoot}`);
  
  
}

export default ioServicesGenerator;
