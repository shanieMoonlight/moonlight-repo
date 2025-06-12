import * as fs from 'fs';
import * as path from 'path';
import { extractControllersFromSwagger } from './extract-controllers';


// ################################//

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// - - - - - - - - - - - - - - - - //

function generateControllerClass(controller: { name: string; actions: { name: string }[] }) {
  const className = `${capitalize(controller.name)}ControllerRoutes`;
  const actionsUnion = controller.actions
    .map(a => `  | '${a.name}'`)
    .join('\n');

  return `\n\nconst CONTROLLER = '${controller.name}';\n\ntype ACTIONS =\n${actionsUnion}\n\n//#################################################//\n\nexport class ${className} {\n  public static readonly Controller = CONTROLLER;\n\n  static action = (action: ACTIONS): string => action\n}\n`;
}


// - - - - - - - - - - - - - - - - //


function main() {
  const [swaggerPath, outputDir] = process.argv.slice(2);
  if (!swaggerPath || !outputDir) {
    console.error('Usage: ts-node generate-controller-routes.ts <swagger.json> <output-folder>');
    process.exit(1);
  }

  const controllers = extractControllersFromSwagger(swaggerPath);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const controller of controllers) {
    const classCode = generateControllerClass(controller);
    const filename = `${controller.name.toLowerCase()}.controller.ts`;
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, classCode, 'utf8');
    console.log(`Wrote ${filePath}`);
  }
}


// ################################//


if (require.main === module) {
  main();
}


// npx ts-node -P tsconfig.scripts.json  scripts-ts/swagger/generate-controller-routes.ts scripts-ts/swagger/swagger.example.json scripts-ts/swagger/controller-routes.generated.ts

// npx ts-node -P tsconfig.scripts.json scripts-ts/swagger/generate-controller-routes.ts scripts-ts/swagger/swagger.example.json apps/myid/myid-demo/src/app/config/io/id/controllers
// npx ts-node -P tsconfig.scripts.json scripts-ts/swagger/generate-controller-routes.ts scripts-ts/swagger/swagger.example.json C:/Users/Shaneyboy/Desktop/GeneratorTest