import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import { extractControllersFromSwaggerJson } from './extract-swagger-contollers';
import { generateControllerRoutes } from './generate-controller-routes';
import { generateInterfacesFromJson } from './generate-interfaces';
import { generateServices } from './generate-services';
import { OutputDirectories, GenerateResults } from './models';
import { logGeneratedResults } from './swg-utils';


const SERVER_ROUTES_CLASS_NAME = 'ServerRoutes';
const A_BASE_IO_SERVICE_CLASS_NAME = 'AServerIoService';

function createDirectoriesIfNotExists(outputDir: string): OutputDirectories {
    const modelsDir = path.join(outputDir, 'models');
    const controllersDir = path.join(outputDir, 'controllers');
    const ioDir = path.join(outputDir, 'io');

    if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });
    if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });
    if (!fs.existsSync(ioDir)) fs.mkdirSync(ioDir, { recursive: true });

    return { modelsDir, controllersDir, ioDir };
}


// - - - - - - - - - - - - - - - - //


export async function generateAllFromUrl(swaggerUrl: string, outputDir: string): Promise<GenerateResults> {



    const outputDirectories = createDirectoriesIfNotExists(outputDir);
    const { modelsDir, controllersDir, ioDir } = outputDirectories;

    // Fetch Swagger JSON from URL
    console.log(`Fetching Swagger JSON from: ${swaggerUrl}`);
    const response = await fetch(swaggerUrl);
    if (!response.ok) {
        console.error(`Failed to fetch Swagger JSON: ${response.statusText}`);
        process.exit(1);
    }
    const swaggerJson = await response.json();

    const controllers = extractControllersFromSwaggerJson(swaggerJson);

    console.log(`Extracted ${controllers.length} controllers from Swagger endpoint: ${swaggerUrl}`);

    // Generate interfaces
    console.log('Generating interfaces...');
    const generatedInterfaces = generateInterfacesFromJson(swaggerJson, modelsDir);

    // Generate controller routes
    console.log('Generating controller routes...');
    const generatedControllerRoutes = generateControllerRoutes(controllers, controllersDir);

    // Generate io services
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
