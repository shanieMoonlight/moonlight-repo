import * as fs from 'fs';
import * as path from 'path';
import { ControllerDefinition, Action, Paramater } from './models'; // Adjust the import path as needed
//npx ts-node -P tsconfig.scripts.json  scripts-ts/swagger/extract-controllers.ts scripts-ts/swagger/swagger.example.json

// ################################//

// Helper to extract parameter names from an operation object
function extractParamNames(operation: unknown): Paramater[] {
    if (operation && typeof operation === 'object' && Array.isArray((operation as { parameters?: unknown[] }).parameters)) {
        return ((operation as { parameters?: { name?: string; schema?: { type?: string; format?: string } }[] }).parameters || [])
            .map((param) => {
                if (param && typeof param === 'object' && 'name' in param) {
                    const name = (param as { name: string }).name;
                    const schema = (param as { schema?: { type?: string; format?: string } }).schema || {};
                    const type = schema.type || '';
                    const paramObj: Paramater = { name, type };
                    if (schema.format) paramObj.format = schema.format;
                    return paramObj;
                }
                return undefined;
            })
            .filter((p): p is Paramater => !!p);
    }
    return [];
}

// - - - - - - - - - - - - - - - - //

// Main extraction function
export function extractControllersFromSwagger(swaggerPath: string): ControllerDefinition[] {
    const swaggerContent = fs.readFileSync(swaggerPath, 'utf8');
    const swagger = JSON.parse(swaggerContent);
    const controllersMap = new Map<string, ControllerDefinition>();

    for (const [pathKey, pathObj] of Object.entries(swagger.paths)) {
        const segments = pathKey.split('/').filter(Boolean);
        
        if (segments.length < 2)
            continue;
        
        const controllerName = segments[1];
        const actionName = segments[2] || 'root';

        let controller = controllersMap.get(controllerName);
        if (!controller) {
            controller = {
                name: controllerName,
                description: `Controller for ${controllerName}`,
                actions: []
            };
            controllersMap.set(controllerName, controller);
        }

        // Iterate over HTTP methods in the path object
        for (const [method, operation] of Object.entries(pathObj as Record<string, unknown>)) {
            // Only process standard HTTP methods
            if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
            // Use helper to extract parameter names
            const params = extractParamNames(operation);
            const action: Action = {
                name: actionName,
                method: method.toUpperCase(),
                paramType: 'query',
                params,
                description: `Auto-extracted action ${actionName} (${method.toUpperCase()}) from path ${pathKey}`
            };
            controller.actions.push(action);
        }
    }

    return Array.from(controllersMap.values());
}

// ################################//

// If run directly, print the result for the provided swagger file
if (require.main === module) {
    const swaggerPath = process.argv[2] || path.join(__dirname, 'swagger.example.json');
    console.log(`Extracting controllers from Swagger file: ${swaggerPath}`);

    const result = extractControllersFromSwagger(swaggerPath);
    const outputPath = path.join(__dirname, 'controllers-extracted.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Extracted controllers written to ${outputPath}`);
}
