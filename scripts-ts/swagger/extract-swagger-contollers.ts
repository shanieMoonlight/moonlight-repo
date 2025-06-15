import * as fs from 'fs';
import * as path from 'path';
import { ControllerDefinition, Action, Paramater, ResponseBody, SwgJsonActionParamter, SwgJsonParamaterSchema } from './models'; // Adjust the import path as needed
//npx ts-node -P tsconfig.scripts.json  scripts-ts/swagger/extract-swagger-contollers.ts scripts-ts/swagger/swagger.example.json
//npx ts-node -P tsconfig.scripts.json  scripts-ts/swagger/extract-swagger-contollers.ts scripts-ts/swagger/swagger.simple.example.json

// ################################//

// Helper to extract parameter names from an operation object
function extractParamNames(operation: unknown): Paramater[] {

    console.log(`Extracting parameters from operation: ${JSON.stringify(operation, null, 2)}`);
    
    if (!operation || typeof operation !== 'object' || !Array.isArray((operation as { parameters?: unknown[] }).parameters))
        return []


    return ((operation as { parameters?: SwgJsonActionParamter[] }).parameters || [])
        .map((param) => {
            if (!param || typeof param !== 'object' || !('name' in param))
                return undefined;

            const name = (param as { name: string }).name;
            const schema = (param as { schema?: SwgJsonParamaterSchema}).schema || {};
            const type = schema.type || '';
            const paramObj: Paramater = { name, type };

            if (schema.format)
                paramObj.format = schema.format;
            return paramObj;
        })
        .filter((p): p is Paramater => !!p);

}

// - - - - - - - - - - - - - - - - //

// Helper to extract request body type from an operation object
function extractRequestBody(operation: unknown): string | undefined {
    if (!operation || typeof operation !== 'object')
        return undefined;

    const op = operation as { requestBody?: { content?: Record<string, any> } };
    if (!op.requestBody || !op.requestBody.content)
        return undefined;

    const content = op.requestBody.content;
    // Prefer application/json, otherwise pick the first available
    const schemaObj = content['application/json'] || Object.values(content)[0];
    if (!schemaObj || !schemaObj.schema)
        return undefined;

    const schema = schemaObj.schema;
    if (schema.$ref)
        return schema.$ref.split('/').pop();

    // Optionally, handle inline schemas here if needed
    return undefined;
}

// - - - - - - - - - - - - - - - - //

// Helper to extract response body type from an operation object
function extractResponseBody(operation: unknown): ResponseBody | undefined {
    if (!operation || typeof operation !== 'object')
        return undefined;


    const op = operation as { responses?: Record<string, any> };

    if (!op.responses)
        return undefined;

    // Get the first status code (e.g., '200', '201', etc.)
    const statusCode = Object.keys(op.responses)[0];
    if (!statusCode)
        return undefined;

    const responseObj = op.responses[statusCode];
    if (!responseObj || !responseObj.content)
        return undefined;

    const content = responseObj.content;
    // Prefer application/json, otherwise pick the first available
    const schemaObj = content['application/json'] || Object.values(content)[0];
    if (!schemaObj || !schemaObj.schema)
        return undefined;

    const schema = schemaObj.schema;
    if (schema?.$ref) {
        return {
            type: schema.$ref.split('/').pop()
        }
    }

    //Check for arrays
    const items = schema.items;
    if (items?.$ref) {
        return {
            type: `${items.$ref.split('/').pop()}`,
            isArray: true
        }
    }
    console.log(`Extracting items: ${JSON.stringify(items, null, 2)}`);

    // Optionally, handle inline schemas here if needed
    return undefined;
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
        const actionName = segments[2] || undefined;

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
            if (!['get', 'post', 'put', 'patch', 'delete'].includes(method))
                continue;

            // Use helper to extract parameter names
            const params = extractParamNames(operation);
            const requestBodyType = extractRequestBody(operation);
            const responseBody = extractResponseBody(operation);
            const action: Action = {
                name: actionName,
                method: method.toUpperCase(),
                paramType: 'query',
                params,
                description: `Auto-extracted action ${actionName} (${method.toUpperCase()}) from path ${pathKey}`,
                requestBodyType,
                responseBody
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
