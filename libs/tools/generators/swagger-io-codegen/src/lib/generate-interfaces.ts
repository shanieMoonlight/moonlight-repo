import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import { json, workspaces } from '@angular-devkit/core';
import * as fs from 'fs';
import * as path from 'path';
import { SwgStringUtils } from './swg-string-utils';


function getRefsFromSchema(schema: any): string[] {

  const refs: string[] = [];

  if (!schema)
    return refs;

  if (schema.$ref)
    refs.push(refToTsType(schema.$ref));

  if (schema.type === 'array' && schema.items)
    refs.push(...getRefsFromSchema(schema.items));

  if (schema.type === 'object' && schema.properties) {
    for (const prop of Object.values(schema.properties)) {
      refs.push(...getRefsFromSchema(prop));
    }
  }

  return refs;
}


// - - - - - - - - - - - - - - - - //


function swaggerTypeToTs(prop: any, swagger: any): string {

  if (prop.$ref)
    return refToTsType(prop.$ref)

  if (prop.type === 'array') {
    return prop.items
      ? `${swaggerTypeToTs(prop.items, swagger)}[]`
      : 'any[]';
  }

  if (prop.enum)
    return prop.enum.map((v: unknown) => JSON.stringify(v)).join(' | ')

  switch (prop.type) {
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
      if (prop.format === 'date-time' || prop.format === 'date')
        return 'string';
      return 'string';
    case 'object':
      return prop.properties
        ? `{ ${Object.entries(prop.properties)
          .map(([k, v]) => `${k}: ${swaggerTypeToTs(v, swagger)}`)
          .join('; ')} }`
        : 'Record<string, any>';
    default:
      return 'any';
  }
}


// - - - - - - - - - - - - - - - - //


function refToTsType(ref: string): string {
  return ref.split('/').pop() || 'any';
}


// - - - - - - - - - - - - - - - - //


function schemaToInterface(name: string, schema: any, swagger: any): { code: string; imports: string[] } {
  const imports = Array.from(new Set(getRefsFromSchema(schema))).filter(ref => ref !== name);
  let importStmts = '';

  if (imports.length) {
    importStmts = imports
      .map(ref => `import { ${ref} } from './${SwgStringUtils.interfaceFilename(ref).replace(/\.ts$/, '')}';`)
      .join('\n') + '\n\n';
  }

  if (schema.enum) {
    return {
      code: `${importStmts}export type ${name} = ${schema.enum.map((v: any) => JSON.stringify(v)).join(' | ')};\n`,
      imports
    };
  }

  if (schema.type !== 'object' || !schema.properties) {
    return {
      code: `${importStmts}export type ${name} = ${swaggerTypeToTs(schema, swagger)};\n`,
      imports
    };
  }

  const required = schema.required || [];
  const props = Object.entries(schema.properties)
    .map(([propName, propSchema]: [string, any]) => {

      let tsType = ''

      if (propSchema.$ref)
        tsType = refToTsType(propSchema.$ref);
      else if (propSchema.type === 'array' && propSchema.items && propSchema.items.$ref)
        tsType = `${refToTsType(propSchema.items.$ref)}[]`;
      else
        tsType = swaggerTypeToTs(propSchema, swagger);

      const optional = required.includes(propName) ? '' : '?';
      return `  ${propName}${optional}: ${tsType};`;
    })
    .join('\n')

  return {
    code: `${importStmts}export interface ${name} {\n${props}\n}\n`,
    imports
  }

}


// - - - - - - - - - - - - - - - - //


export async function generateInterfacesFromUrlAsync(tree: Tree, swaggerUrl: string, outputDir: string): Promise<string[]> {

  // Fetch Swagger JSON from URL
  console.log(`Fetching Swagger JSON from: ${swaggerUrl}`);
  const response = await fetch(swaggerUrl);
  if (!response.ok) {
    console.error(`Failed to fetch Swagger JSON: ${response.statusText}`);
    process.exit(1);
  }
  const swaggerJson = await response.json();
  return generateInterfacesFromJson(tree, swaggerJson, outputDir);
}

// - - - - - - - - - - - - - - - - //


export function generateInterfacesFromPath(tree: Tree, swaggerPath: string, outputDir: string): string[] {
  const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  return generateInterfacesFromJson(tree, swagger, outputDir);
}

// - - - - - - - - - - - - - - - - //


export function generateInterfacesFromJson(tree: Tree, swagger: any, outputDir: string): string[] {
  const schemas = swagger.components?.schemas;

  if (!schemas) {
    console.error('No schemas found in Swagger file.');
    process.exit(1);
  }

  const generatedFiles: string[] = [];

  const indexExports: string[] = [];
  for (const [name, schema] of Object.entries(schemas)) {
    const { code } = schemaToInterface(name, schema, swagger);
    const filename = SwgStringUtils.interfaceFilename(name);
    const filePath = path.join(outputDir, filename);
    tree.write(filePath, code);
    generatedFiles.push(filePath);
    indexExports.push(`export * from './${filename.replace(/\.ts$/, '')}';`);
  }
  // Write index.ts
  tree.write(path.join(outputDir, 'index.ts'), indexExports.join('\n') + '\n');
  console.log(`TypeScript interfaces written to ${outputDir}`);
  return generatedFiles;
}


// npx ts-node -P tsconfig.scripts.json scripts-ts/swagger/generate-interfaces.ts scripts-ts/swagger/swagger.example.json C:/Users/Shaneyboy/Desktop/GeneratorTest/Models