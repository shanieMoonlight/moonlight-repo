// import { } from '@nx/angular';
// import { addProjectConfiguration, formatFiles, generateFiles, names, Tree, } from '@nx/devkit';
// import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
// import { } from '@nx/js';
// import * as path from 'path';
// import { NoramlizedSectionGeneratorSchema, SectionGeneratorSchema } from './schema';
// import { libraryGenerator } from '@nx/angular/generators';

// //##############################################//

// async function normalizeOptionsAsync(tree: Tree, options: SectionGeneratorSchema): Promise<NoramlizedSectionGeneratorSchema> {

//   const name = options.name;
//   const directory = options.directory ?? name;

//   const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, {
//     ...options,
//     directory,
//     projectType: 'library'
//   });
  
//   const sectionRoot = nameAndRootOptions.projectRoot;

//   console.log(`names(name): `, names(name));

//   return {
//     ...options,
//     sectionRoot,
//     directory: directory
//   };
// }

// //------------------------------//

// async function genberateEntryPointLibrary(tree: Tree, options: NoramlizedSectionGeneratorSchema) {

//   await libraryGenerator(tree, options);

// }


// //------------------------------//

// export async function sectionGenerator(tree: Tree, options: SectionGeneratorSchema) {

//   const normalizedOptions = await normalizeOptionsAsync(tree, options);
//   console.log(`normalizedOptions:`, normalizedOptions);

//   const nameAndRootOptions = await determineProjectNameAndRootOptions(tree, { ...normalizedOptions, projectType: 'library' });
//   const sectionRoot = nameAndRootOptions.projectRoot;
//   console.log(`sectionRoot:`, sectionRoot);
//   console.log(`nameAndRootOptions:`, nameAndRootOptions);

//   const projectRoot = `libs/${options.name}`;
//   console.log(`Creating section ${options.name} in ${projectRoot}`);
//   console.log('ioptions', options);



//   addProjectConfiguration(tree, options.name, {
//     root: projectRoot,
//     projectType: 'library',
//     sourceRoot: `${projectRoot}/src`,
//     targets: {},
//   });


//   generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
//   await formatFiles(tree);
// }

// //##############################################//

// export default sectionGenerator;

// //##############################################//