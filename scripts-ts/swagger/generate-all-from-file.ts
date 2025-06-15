import * as fs from 'fs';
import * as path from 'path';
import { extractControllersFromSwaggerPath } from './extract-swagger-contollers';
import { generateControllerRoutes } from './generate-controller-routes';
import { generateInterfacesFromPath } from './generate-interfaces';
import { generateServices } from './generate-services';
import { GenerateResults, OutputDirectories } from './models';
import { logGeneratedResults } from './swg-utils';

// ################################//

const SERVER_ROUTES_CLASS_NAME = 'ServerRoutes';
const A_BASE_IO_SERVICE_CLASS_NAME = 'AServerIoService';


// ################################//

function createDirectoriesIfNotExists(outputDir: string): OutputDirectories {

    // Ensure output subfolders exist
    const modelsDir = path.join(outputDir, 'models');
    const controllersDir = path.join(outputDir, 'controllers');
    const ioDir = path.join(outputDir, 'io');

    if (!fs.existsSync(modelsDir))
        fs.mkdirSync(modelsDir, { recursive: true });

    if (!fs.existsSync(controllersDir))
        fs.mkdirSync(controllersDir, { recursive: true });

    if (!fs.existsSync(ioDir))
        fs.mkdirSync(ioDir, { recursive: true });

    return { modelsDir, controllersDir, ioDir };
}

// - - - - - - - - - - - - - - - - //

export  function generateAllFromPath(swaggerPath: string, outputDir: string): GenerateResults {


    const outputDirectories = createDirectoriesIfNotExists(outputDir);
    const { modelsDir, controllersDir, ioDir } = outputDirectories;

    const controllers = extractControllersFromSwaggerPath(swaggerPath);

    console.log(`Extracted ${controllers.length} controllers from Swagger file: ${swaggerPath}`);

    // console.log(JSON.stringify(controllers, null, 2));



    // Run generate-interfaces.ts
    console.log('Generating interfaces...');
    const generatedInterfaces = generateInterfacesFromPath(swaggerPath, modelsDir);

    // Run generate-controller-routes.ts
    console.log('Generating controller routes...');
    const generatedControllerRoutes = generateControllerRoutes(controllers, controllersDir);

    // Run generate-controller-routes.ts
    console.log('Generating io services...');
    const generatedServices = generateServices(controllers, ioDir, A_BASE_IO_SERVICE_CLASS_NAME, SERVER_ROUTES_CLASS_NAME);

    console.log('All codegen steps complete.');
    
    return {
        interfaces: generatedInterfaces,
        services: generatedServices,
        controllerRoutes: generatedControllerRoutes
    };


}

// - - - - - - - - - - - - - - - - //

function main() {

    const [swaggerPath, outputDir] = process.argv.slice(2)

    if (!swaggerPath || !outputDir) {
        console.error('Usage: ts-node generate-all.ts <swagger.json> <outputDir>');
        process.exit(1);
    }

    
    const results = generateAllFromPath(swaggerPath, outputDir);
    logGeneratedResults(results);

}

// ################################//

if (require.main === module) {
    main();
}

// ################################//




//       npx ts-node -P tsconfig.scripts.json scripts-ts/swagger/generate-all.ts scripts-ts/swagger/swagger.example.json scripts-ts/swagger/generated