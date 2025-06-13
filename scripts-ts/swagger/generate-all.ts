import * as fs from 'fs';
import * as path from 'path';
import { extractControllersFromSwagger } from './extract-swagger-contollers';
import { generateControllerRoutes } from './generate-controller-routes';
import { generateInterfaces } from './generate-interfaces';
// Usage: ts-node generate-all.ts <swagger.json> <outputDir>
// ################################//

interface OutputDirectories {
    modelsDir: string;
    controllersDir: string;
}


// ################################//

function createDirectoriesIfNotExists(outputDir: string): OutputDirectories {

    // Ensure output subfolders exist
    const modelsDir = path.join(outputDir, 'models');
    const controllersDir = path.join(outputDir, 'controllers');

    if (!fs.existsSync(modelsDir))
        fs.mkdirSync(modelsDir, { recursive: true });

    if (!fs.existsSync(controllersDir))
        fs.mkdirSync(controllersDir, { recursive: true });

    return { modelsDir, controllersDir };
}

// - - - - - - - - - - - - - - - - //

function main() {

    const [swaggerPath, outputDir] = process.argv.slice(2)

    if (!swaggerPath || !outputDir) {
        console.error('Usage: ts-node generate-all.ts <swagger.json> <outputDir>');
        process.exit(1);
    }

    const outputDirectories = createDirectoriesIfNotExists(outputDir);
    const { modelsDir, controllersDir } = outputDirectories;

    const controllers = extractControllersFromSwagger(swaggerPath);

    // Run generate-interfaces.ts
    console.log('Generating interfaces...');
    generateInterfaces(swaggerPath, modelsDir);

    // Run generate-controller-routes.ts
    console.log('Generating controller routes...');
    generateControllerRoutes(controllers, controllersDir);

    console.log('All codegen steps complete.');
}

// ################################//

if (require.main === module) {
    main();
}

// ################################//




//       npx ts-node -P tsconfig.scripts.json scripts-ts/swagger/generate-all.ts scripts-ts/swagger/swagger.example.json scripts-ts/swagger/generated