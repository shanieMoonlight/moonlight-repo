import * as fs from 'fs';
import * as path from 'path';

// ################################//


// Utility to resolve $ref
function resolveRef(ref: string, swagger: any): any {
    if (!ref.startsWith('#/')) return undefined;
    const pathParts = ref.slice(2).split('/');
    let result = swagger;
    for (const part of pathParts) {
        result = result[part];
        if (!result) break;
    }
    return result;
}


// - - - - - - - - - - - - - - - - //

// Convert a Swagger schema property to TypeScript type
function swaggerTypeToTs(prop: any, swagger: any): string {

    if (prop.$ref)
        return refToTsType(prop.$ref);

    if (prop.type === 'array') {
        if (prop.items) {
            return `${swaggerTypeToTs(prop.items, swagger)}[]`;
        }
        return 'any[]';
    }

    if (prop.enum)
        return prop.enum.map((v: any) => JSON.stringify(v)).join(' | ');

    switch (prop.type) {
        case 'integer':
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'string':
            if (prop.format === 'date-time' || prop.format === 'date') return 'string'; // Could use Date
            return 'string';
        case 'object':
            if (prop.properties) {
                // Inline object type
                return `{ ${Object.entries(prop.properties)
                    .map(([k, v]) => `${k}: ${swaggerTypeToTs(v, swagger)}`)
                    .join('; ')} }`;
            }
            return 'Record<string, any>';
        default:
            return 'any';
    }
}


// - - - - - - - - - - - - - - - - //

// Convert $ref to TypeScript type name
function refToTsType(ref: string): string {
    return ref.split('/').pop() || 'any';
}


// - - - - - - - - - - - - - - - - //

// Generate TypeScript interface from a schema
function schemaToInterface(
    name: string,
    schema: any,
    swagger: any
): string {
    if (schema.enum) {
        // Enum as union type
        return `export type ${name} = ${schema.enum.map((v: any) => JSON.stringify(v)).join(' | ')};\n`;
    }
    if (schema.type !== 'object' || !schema.properties) {
        return `export type ${name} = ${swaggerTypeToTs(schema, swagger)};\n`;
    }
    const required = schema.required || [];
    const props = Object.entries(schema.properties)
        .map(([propName, propSchema]: [string, any]) => {
            let tsType = '';
            if (propSchema.$ref) {
                tsType = refToTsType(propSchema.$ref);
            } else if (propSchema.type === 'array' && propSchema.items && propSchema.items.$ref) {
                tsType = `${refToTsType(propSchema.items.$ref)}[]`;
            } else {
                tsType = swaggerTypeToTs(propSchema, swagger);
            }
            const optional = required.includes(propName) ? '' : '?';
            return `  ${propName}${optional}: ${tsType};`;
        })
        .join('\n');
    return `export interface ${name} {\n${props}\n}\n`;
}


// - - - - - - - - - - - - - - - - //

// Main function
function generateInterfaces(swaggerPath: string, outputPath: string) {
    const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
    const schemas = swagger.components?.schemas;
    if (!schemas) {
        console.error('No schemas found in Swagger file.');
        process.exit(1);
    }

    let output = `// Auto-generated from Swagger schemas\n\n`;

    for (const [name, schema] of Object.entries(schemas)) {
        output += schemaToInterface(name, schema, swagger) + '\n';
    }

    fs.writeFileSync(outputPath, output, 'utf8');
    console.log(`TypeScript interfaces written to ${outputPath}`);
}


// ################################//

// CLI usage
if (require.main === module) {
    const [swaggerPath, outputPath] = process.argv.slice(2);
    if (!swaggerPath || !outputPath) {
        console.error('Usage: ts-node generate-interfaces.ts <swagger.json> <output.ts>');
        process.exit(1);
    }
    generateInterfaces(swaggerPath, outputPath);
}