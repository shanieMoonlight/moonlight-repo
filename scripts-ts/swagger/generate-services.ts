import * as fs from 'fs';
import * as path from 'path';
import { SwgStringUtils } from './swg-string-utils';

// ################################//

// Main codegen function
/**
 * Generates Angular service classes for each controller in controllers-extracted.json
 * @param controllersJsonPath Path to controllers-extracted.json
 * @param outputDir Output directory for generated services
 * @param baseServiceClass Name of the base service class to extend (default: 'IdentityIoService')
 * @param serverRoutesClass Name of the server routes class (default: 'ServerRoutes')
 */
export function generateServices(controllersJsonPath: string, outputDir: string, baseServiceClass = 'IdentityIoService', serverRoutesClass = 'ServerRoutes') {

    const controllers = JSON.parse(fs.readFileSync(controllersJsonPath, 'utf8'));

    if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });

    for (const controller of controllers) {
        if (!controller.name || !Array.isArray(controller.actions)) continue;
        const className = `${SwgStringUtils.capitalize(controller.name)}IoService`;
        const controllerRoute = `${serverRoutesClass}.${SwgStringUtils.capitalize(controller.name)}.Controller`;
        const importTypes = new Set<string>();
        let methods = '';
        for (const action of controller.actions) {
            if (!action.name)
                continue;

            const methodName = SwgStringUtils.toCamelCase(action.name);
            const responseType = action.responseBodyType || 'any';
            const requestType = action.requestBodyType || undefined;

            if (responseType && responseType !== 'any')
                importTypes.add(responseType);

            if (requestType && requestType !== 'any')
                importTypes.add(requestType);

            let baseMethod = 'getAction';

            if (action.method === 'POST')
                baseMethod = 'postAction';
            else if (action.method === 'PATCH')
                baseMethod = 'patchAction';
            else if (action.method === 'DELETE')
                baseMethod = 'delete';

            // Params (not implemented: paramType/params for id/date)
            if (requestType)
                methods += buildServiceMethodWithRequest(methodName, requestType, responseType, baseMethod, serverRoutesClass, controller.name, action.name);
            else
                methods += buildServiceMethodNoRequest(methodName, responseType, baseMethod, serverRoutesClass, controller.name, action.name);

        }
        // Imports
        const importStmts = buildServiceImports(baseServiceClass, serverRoutesClass, importTypes);

        // Service class
        const serviceCode = buildServiceClassCode(importStmts, className, baseServiceClass, controllerRoute, methods);
        // Write file
        const filename = `${controller.name.toLowerCase()}.io.service.ts`;
        fs.writeFileSync(path.join(outputDir, filename), serviceCode, 'utf8');
        console.log(`Wrote ${filename}`);
    }
}

// - - - - - - - - - - - - - - - - //

/**
 * Builds a service method string for an action with a request body.
 */
function buildServiceMethodWithRequest(methodName: string, requestType: string, responseType: string, baseMethod: string, serverRoutesClass: string, controllerName: string, actionName: string) {
    return `\n  ${methodName} = (dto: ${requestType}, opts?: unknown): Observable<${responseType}> =>\n    this.${baseMethod}<${responseType}>(\n      ${serverRoutesClass}.${SwgStringUtils.capitalize(controllerName)}.action('${actionName}'),\n      dto,\n      opts ?? {}\n    );\n`;
}

/**
 * Builds a service method string for an action without a request body.
 */
function buildServiceMethodNoRequest(methodName: string, responseType: string, baseMethod: string, serverRoutesClass: string, controllerName: string, actionName: string) {
    return `\n  ${methodName} = (opts?: unknown): Observable<${responseType}> =>\n    this.${baseMethod}<${responseType}>(\n      ${serverRoutesClass}.${SwgStringUtils.capitalize(controllerName)}.action('${actionName}'),\n      opts ?? {}\n    );\n`;
}

/**
 * Builds the import statements for a generated service file.
 */
function buildServiceImports(baseServiceClass: string, serverRoutesClass: string, importTypes: Set<string>): string {
  let importStmts = `import { Injectable } from '@angular/core';\nimport { Observable } from 'rxjs';\nimport { ${baseServiceClass} } from '../base/${baseServiceClass.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1)}';\nimport { ${serverRoutesClass} } from '../../config/io/id/all-server-routes';\n`;
  if (importTypes.size)
    importStmts += `import { ${Array.from(importTypes).join(', ')} } from '../../models';\n`;
  return importStmts;
}

/**
 * Builds the full service class code for a generated Angular service.
 */
function buildServiceClassCode(importStmts: string, className: string, baseServiceClass: string, controllerRoute: string, methods: string): string {
  return `\n${importStmts}\n@Injectable({ providedIn: 'root' })\nexport class ${className} extends ${baseServiceClass} {\n  constructor() {\n    super(${controllerRoute});\n  }\n${methods}\n}\n`;
}

// ################################//

// CLI usage
if (require.main === module) {
    const [controllersJsonPath, outputDir, baseServiceClass, serverRoutesClass] = process.argv.slice(2);
    if (!controllersJsonPath || !outputDir) {
        console.error('Usage: ts-node generate-services.ts <controllers-extracted.json> <output-folder> [baseServiceClass] [serverRoutesClass]');
        process.exit(1);
    }
    generateServices(controllersJsonPath, outputDir, baseServiceClass, serverRoutesClass);
}
