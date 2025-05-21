import { addProjectConfiguration, formatFiles, generateFiles, Tree, } from '@nx/devkit';
import * as path from 'path';
import { componentGenerator as ngComponentGenerator, } from '@nx/angular/generators';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { ComponentGeneratorSchema, NoramlizedComponentGeneratorSchema } from './schema';
import { Schema } from '@nx/angular/src/generators/component/schema';

//-----------------------------//

function normalizeOptions(tree: Tree, options: ComponentGeneratorSchema): NoramlizedComponentGeneratorSchema {

  const directory = options.directory || options.name;
  return {
    ...options,
    directory: directory + '/' + directory,
    prefix: options.prefix || 'sb',
  }

}

//-----------------------------//


function generateComponentSchema(tree: Tree, options: NoramlizedComponentGeneratorSchema): Schema {

  return {
    path: options.directory,
    name: options.name,
    displayBlock: true,
    inlineStyle: false,
    inlineTemplate: false,
    standalone: true,
    changeDetection: 'OnPush',
    style: 'scss',
    skipTests: false,
    skipImport: true,
    selector: options.prefix + '-' + options.name,
    export: false,
    exportDefault: false,
    prefix: options.prefix,
    skipFormat: false,
  }

}

//-----------------------------//

export async function componentGenerator(tree: Tree, options: ComponentGeneratorSchema) {

  const normalizedOptions = normalizeOptions(tree, options);
  const generateSchema = generateComponentSchema(tree, normalizedOptions);
  console.log('generateSchema', generateSchema);
  


  await ngComponentGenerator(tree, generateSchema);




}

export default componentGenerator;
