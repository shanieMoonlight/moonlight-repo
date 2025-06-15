import * as path from 'path';
import { actionToServiceMethod } from './action-to-service-method';
import { extractControllersFromSwaggerPath } from './extract-swagger-contollers';
import { ControllerDefinition } from './models';
import { SwgConstants } from './swg-constants';
import { SwgStringUtils } from './swg-string-utils';
import { Tree } from '@nx/devkit';

// ################################//

/**
 * Builds the import statements for a generated service file.
 */
function buildServiceImports(serverRoutesClass: string, importTypes: Set<string>): string {
    let importStmts = `import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ${SwgConstants.baseIoServiceClassName} } from './base/${SwgConstants.baseIoServiceFilename.replace(/\.ts$/, '')}';
import { ${serverRoutesClass} } from '../controllers/all-server-routes';\n`;

    if (importTypes.size)
        importStmts += `import { ${Array.from(importTypes).join(', ')} } from '../models';\n`;
    return importStmts;
}

// - - - - - - - - - - - - - - - - //

/**
 * Builds the full service class code for a generated Angular service.
 */
function buildServiceClassCode(importStmts: string, className: string, baseServiceClass: string, controllerRoute: string, methods: string): string {
    return `\n${importStmts}\n@Injectable({ providedIn: 'root' })
export class ${className} extends ${baseServiceClass} {\n
    constructor() {
        super(${controllerRoute});
    }\n${methods}
}\n`;
}

// - - - - - - - - - - - - - - - - //

function generateBaseIOServiceCode(serverRoutesClass?: string): string {

    return `
import { ${serverRoutesClass} } from '../../controllers/all-server-routes';
import { ABaseHttpService } from '../../data-service/a-base-data.io.service';
import { UrlUtils } from '../../data-service/url-utils';


export abstract class ${SwgConstants.baseIoServiceClassName} extends ABaseHttpService {
        
    constructor(controller: string) {
        super(UrlUtils.combine(${serverRoutesClass}.BASE_URL, controller));
    }
        
}
        `

}

// --------------------------------//

export function generateServicesSwaggerJson(
    tree: Tree, 
    swaggerPath: string, 
    outputDir: string, 
    baseServiceClass?: string, 
    serverRoutesClass?: string): string[] {
    const controllers = extractControllersFromSwaggerPath(swaggerPath);
    return generateServices(tree, controllers, outputDir, baseServiceClass, serverRoutesClass);
}

// - - - - - - - - - - - - - - - - //

/**
 * Generates Angular service classes for each controller in a ControllerDefinition array.
 * @param controllers Array of ControllerDefinition objects
 * @param outputDir Output directory for generated services
 * @param baseServiceClass Name of the base service class to extend (default: 'IdentityIoService')
 * @param serverRoutesClass Name of the server routes class (default: 'ServerRoutes')
 * @returns Array of file paths written
 */
export function generateServices(
    tree: Tree, 
    controllers: ControllerDefinition[],
    outputDir: string,
    baseServiceClass = SwgConstants.baseIoServiceClassName,
    serverRoutesClass = SwgConstants.baseIoRoutesClassName): string[] {

    if (!Array.isArray(controllers) || !controllers.length) {
        console.error('No controllers provided to generateServices. Skipping code generation.');
        return [];
    }

    const baseServiceCode = generateBaseIOServiceCode(serverRoutesClass);
    const filePath = path.join(outputDir, SwgConstants.baseIoServiceDir, SwgConstants.baseIoServiceFilename);
    tree.write(filePath, baseServiceCode);

    const writtenFiles: string[] = [];
    const indexExports: string[] = [];
    for (const controller of controllers) {

        if (!controller.name || !Array.isArray(controller.actions))
            continue;

        const className = `${SwgStringUtils.capitalize(controller.name)}IoService`;
        const controllerRoute = `${serverRoutesClass}.${SwgStringUtils.capitalize(controller.name)}.Controller`;
        const importTypes = new Set<string>();
        let methods = '';

        for (const action of controller.actions) {
            // if (!action.name)
            //     continue;

            const responseImportType = action.responseBody?.type || 'any';

            const requestImportType = action.requestBodyType || undefined;

            if (responseImportType && responseImportType !== 'any')
                importTypes.add(responseImportType);

            if (requestImportType && requestImportType !== 'any')
                importTypes.add(requestImportType);

            methods += actionToServiceMethod(action, controller.name, serverRoutesClass);
        }
        const importStmts = buildServiceImports(serverRoutesClass, importTypes);
        const serviceCode = buildServiceClassCode(importStmts, className, baseServiceClass, controllerRoute, methods);
        const filename = `${controller.name.toLowerCase()}.io.service.ts`;
        const filePath = path.join(outputDir, filename);

        tree.write(filePath, serviceCode);
        writtenFiles.push(filePath);
        indexExports.push(`export * from './${filename.replace(/\.ts$/, '')}';`)

        console.log(filename, filename.replace(/\.ts$/, ''));
        
    }

    // Write index.ts
    tree.write(path.join(outputDir, 'index.ts'), indexExports.join('\n') + '\n');
    console.log(`TypeScript interfaces written to ${outputDir}`);
    return writtenFiles;
}