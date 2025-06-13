import * as fs from 'fs';
import * as path from 'path';
import { SwgStringUtils } from './swg-string-utils';
import { Action, ControllerDefinition, ResponseBody } from './models';
import { extractControllersFromSwagger } from './extract-swagger-contollers';

// ################################//

const baseIoServiceFilename = 'base-server-io.service.ts';
const baseIoServiceClassname = 'BaseServerIoService';
const baseIoServiceDir = 'base';

// ################################//

/**
 * Builds a service method string for an action with a request body.
 */
function buildServiceMethodWithRequest(methodName: string, requestType: string, responseType: string, baseMethod: string, serverRoutesClass: string, controllerName: string, actionName: string) {
    return `\n  ${methodName} = (dto: ${requestType}, opts?: unknown): Observable<${responseType}> =>
        this.${baseMethod}<${responseType}>(
           ${serverRoutesClass}.${SwgStringUtils.capitalize(controllerName)}.action('${SwgStringUtils.toCamelCase(actionName)}'),
           dto,
           opts ?? {}
        );
    `;
}

/**
 * Builds a service method string for an action without a request body.
 */
function buildServiceMethodNoRequest(methodName: string, responseType: string, baseMethod: string, serverRoutesClass: string, controllerName: string, actionName: string) {
    return `\n  ${methodName} = (opts?: unknown): Observable<${responseType}> =>
    this.${baseMethod}<${responseType}>(
        ${serverRoutesClass}.${SwgStringUtils.capitalize(controllerName)}.action('${SwgStringUtils.toCamelCase(actionName)}'),
        opts ?? {}
    );
`;
}

// - - - - - - - - - - - - - - - - //

/**
 * Builds the import statements for a generated service file.
 */
function buildServiceImports(serverRoutesClass: string, importTypes: Set<string>): string {
    let importStmts = `import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ${baseIoServiceClassname} } from './base/${baseIoServiceFilename}';
import { ${serverRoutesClass} } from '../controllers/all-server-routes.ts';\n`;

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
    import { ABaseHttpService } from '../data-service/a-base-data.io.service';
    import { RouteUtils } from '../data-service/route-utils';
    
    
    export class ${baseIoServiceClassname} extends ABaseHttpService {
        
    constructor(controller: string) {
        super(RouteUtils.combine(${serverRoutesClass}.BASE_URL, controller));
        }
        
        }
        `

}

// - - - - - - - - - - - - - - - - //

function generateServiceReturnType(action: Action): string {
    const responseBody = action.responseBody
    if (!responseBody || !responseBody.type)
        return 'any'

    return responseBody.isArray
        ? `${responseBody.type}[]`
        : responseBody.type;
}

// --------------------------------//

export function generateServicesSwaggerJson(swaggerPath: string, outputDir: string, baseServiceClass?: string, serverRoutesClass?: string): string[] {
    const controllers = extractControllersFromSwagger(swaggerPath);
    return generateServices(controllers, outputDir, baseServiceClass, serverRoutesClass);
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
    controllers: ControllerDefinition[], outputDir: string, baseServiceClass = 'IdentityIoService', serverRoutesClass = 'ServerRoutes'): string[] {

    if (!Array.isArray(controllers) || !controllers.length) {
        console.error('No controllers provided to generateServices. Skipping code generation.');
        return [];
    }

    if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });

    const baseServiceCode = generateBaseIOServiceCode(serverRoutesClass);
    const filePath = path.join(outputDir, baseIoServiceDir, baseIoServiceFilename);
    fs.writeFileSync(filePath, baseServiceCode, 'utf8');

    const writtenFiles: string[] = [];
    for (const controller of controllers) {

        if (!controller.name || !Array.isArray(controller.actions))
            continue;

        const className = `${SwgStringUtils.capitalize(controller.name)}IoService`;
        const controllerRoute = `${serverRoutesClass}.${SwgStringUtils.capitalize(controller.name)}.Controller`;
        const importTypes = new Set<string>();
        let methods = '';

        for (const action of controller.actions) {
            if (!action.name)
                continue;

            const methodName = SwgStringUtils.toCamelCase(action.name);
            // const responseType = action.responseBody?.type || 'any';
            const responseType = generateServiceReturnType(action)
            const importType = action.responseBody?.type || 'any';
            const requestType = action.requestBodyType || undefined;

            if (importType && importType !== 'any')
                importTypes.add(importType);

            if (requestType && requestType !== 'any')
                importTypes.add(requestType);

            let baseMethod = '_getAction';
            if (action.method === 'POST')
                baseMethod = '_postAction';
            else if (action.method === 'PATCH')
                baseMethod = '_patchAction';
            else if (action.method === 'DELETE')
                baseMethod = '_delete';

            if (requestType)
                methods += buildServiceMethodWithRequest(methodName, requestType, responseType, baseMethod, serverRoutesClass, controller.name, action.name);
            else
                methods += buildServiceMethodNoRequest(methodName, responseType, baseMethod, serverRoutesClass, controller.name, action.name);
        }
        const importStmts = buildServiceImports(serverRoutesClass, importTypes);
        const serviceCode = buildServiceClassCode(importStmts, className, baseServiceClass, controllerRoute, methods);
        const filename = `${controller.name.toLowerCase()}.io.service.ts`;
        const filePath = path.join(outputDir, filename);

        fs.writeFileSync(filePath, serviceCode, 'utf8');
        writtenFiles.push(filePath);
    }
    return writtenFiles;
}

// ################################//

// CLI usage
if (require.main === module) {
    const [swaggerPath, outputDir, baseServiceClass, serverRoutesClass] = process.argv.slice(2);
    if (!swaggerPath || !outputDir) {
        console.error('Usage: ts-node generate-services.ts <controllers-extracted.json> <output-folder> [baseServiceClass] [serverRoutesClass]');
        process.exit(1);
    }
    generateServicesSwaggerJson(swaggerPath, outputDir, baseServiceClass, serverRoutesClass);
}
