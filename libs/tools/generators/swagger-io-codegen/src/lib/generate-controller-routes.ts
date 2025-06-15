import * as path from 'path';
import { extractControllersFromSwaggerPath } from './extract-swagger-contollers';
import { SwgStringUtils } from './swg-string-utils';
import { ControllerDefinition } from './models';
import { Tree } from '@nx/devkit';


// ################################//

function generateControllerClass(controller: ControllerDefinition) {

  const className = `${SwgStringUtils.capitalize(controller.name)}Controller`;
  const actionsUnion = controller.actions
    .map(a => `  | '${SwgStringUtils.toCamelCase(a.name || a.method.toLowerCase())}'`)
    .join('\n');

  return `\n\nconst CONTROLLER = '${controller.name}';\n\n
  type ACTIONS =\n${actionsUnion}\n\n
  //#################################################//\n\n
  export class ${className} {\n  
    public static readonly Controller = CONTROLLER;\n\n  
    static action = (action: ACTIONS): string => action\n
  }\n`

}

// - - - - - - - - - - - - - - - - //

function generateServerRoutesClass(controllerNames: string[], baseUrl?: string) {
  const className = 'ServerRoutes'
  // Build import statements
  const importStmts = controllerNames
    .map(name => {
      const fileName = `${name.toLowerCase()}.controller`;
      const className = `${SwgStringUtils.capitalize(name)}Controller`;
      return `import { ${className} } from './${fileName}';`;
    })
    .join('\n');

  // Build static properties
  const staticProps = controllerNames
    .map(name => {
      const className = `${SwgStringUtils.capitalize(name)}Controller`;
      return `  static readonly ${SwgStringUtils.capitalize(name)} = ${className};`;
    })
    .join('\n');

  // Optionally include a BASE_URL
  const baseUrlProp = `static readonly BASE_URL = '${baseUrl ?? 'https://localhost:1234'}';`;

  return `${importStmts}\n\nexport class ${className} {
  
  ${baseUrlProp}
  
  //controllers
  ${staticProps}
}`;
}

// - - - - - - - - - - - - - - - - //

/**
 * Preferred entrypoint for most CLI and programmatic use cases.
 * Generates controller route classes and a ServerRoutes class from a swagger file path.
 * @param swaggerPath Path to swagger.json
 * @param outputDir Output directory for generated files
 * @param baseUrl Optional base URL for the ServerRoutes class
 *
 * This function will extract controllers from the swagger file and generate all route classes and the ServerRoutes aggregator.
 * If you already have a parsed controller array, use generateControllerRoutes instead.
 */
export function generateControllerRoutesSwaggerJson(
  tree: Tree,
  swaggerPath: string,
  outputDir: string,
  baseUrl?: string): string[] {
  const controllers = extractControllersFromSwaggerPath(swaggerPath);
  return generateControllerRoutes(tree, controllers, outputDir, baseUrl);
}

// - - - - - - - - - - - - - - - - //

/**
 * Generates controller route classes and a ServerRoutes class from a swagger file.
 * @param swaggerPath Path to swagger.json
 * @param outputDir Output directory for generated files
 * @param baseUrl Optional base URL for the ServerRoutes class
 */
export function generateControllerRoutes(
  tree: Tree,
  controllers: ControllerDefinition[],
  outputDir: string,
  baseUrl?: string): string[] {

  if (!controllers?.length) {
    console.error('No controllers provided to generateControllerRoutes. Skipping code generation.');
    return [];
  }


  const controllerNames: string[] = [];
  const writtenFiles: string[] = [];
  for (const controller of controllers) {
    const classCode = generateControllerClass(controller);
    const filename = `${controller.name.toLowerCase()}.controller.ts`;
    const filePath = path.join(outputDir, filename);
    tree.write(filePath, classCode);
    controllerNames.push(controller.name);
    writtenFiles.push(filePath);
  }

  // Generate the ServerRoutes class
  const serverRoutesCode = generateServerRoutesClass(controllerNames, baseUrl)
  const serverRoutesPath = path.join(outputDir, 'all-server-routes.ts')
  tree.write(serverRoutesPath, serverRoutesCode)
  writtenFiles.push(serverRoutesPath)

  return writtenFiles

}


