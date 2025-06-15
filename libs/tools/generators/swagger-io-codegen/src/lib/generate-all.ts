import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import { extractControllersFromSwaggerJson } from './extract-swagger-contollers';
import { generateControllerRoutes } from './generate-controller-routes';
import { generateInterfacesFromJson } from './generate-interfaces';
import { generateServices } from './generate-services';
import { GenerateResults, OutputDirectories } from './models';
import { SwgConstants } from './swg-constants';
import { Tree } from '@nx/devkit';


function getOutputDirectories(outputDir: string): OutputDirectories {
    const modelsDir = path.join(outputDir, 'models');
    const controllersDir = path.join(outputDir, 'controllers');
    const ioDir = path.join(outputDir, 'services');

    return { modelsDir, controllersDir, ioDir };
}


// - - - - - - - - - - - - - - - - //


export async function generateAllSwaggerIoFromPath(
    tree: Tree,
    swaggerPath: string,
    outputDir: string): Promise<GenerateResults> {

    const swaggerContent = fs.readFileSync(swaggerPath, 'utf8');
    const swaggerJson = JSON.parse(swaggerContent);

    return await generateAllSwaggerIoFromJson(tree, swaggerJson, outputDir);
}

// - - - - - - - - - - - - - - - - //


export async function generateAllSwaggerIoFromUrl(
    tree: Tree,
    swaggerUrl: string,
    outputDir: string): Promise<GenerateResults> {



    // Fetch Swagger JSON from URL
    console.log(`Fetching Swagger JSON from: ${swaggerUrl}`);
    const response = await fetch(swaggerUrl);
    if (!response.ok) {
        console.error(`Failed to fetch Swagger JSON: ${response.statusText}`);
        process.exit(1);
    }
    const swaggerJson = await response.json();

    return await generateAllSwaggerIoFromJson(tree, swaggerJson, outputDir);

}


// - - - - - - - - - - - - - - - - //


export async function generateAllSwaggerIoFromJson(
    tree: Tree,
    swaggerJson: any,
    outputDir: string): Promise<GenerateResults> {

    const outputDirectories = getOutputDirectories(outputDir);
    const { modelsDir, controllersDir, ioDir } = outputDirectories;

    const controllers = extractControllersFromSwaggerJson(swaggerJson);

    console.log(`Extracted ${controllers.length} controllers from SwaggerJson`);

    // Generate interfaces
    console.log('Generating interfaces...');
    const generatedInterfaces = generateInterfacesFromJson(tree, swaggerJson, modelsDir);

    // Generate controller routes
    console.log('Generating controller routes...');
    const generatedControllerRoutes = generateControllerRoutes(tree, controllers, controllersDir);

    // Generate io services
    console.log('Generating io services...');
    const generatedServices = generateServices(
        tree,
        controllers,
        ioDir,
        SwgConstants.baseIoServiceClassName,
        SwgConstants.baseIoRoutesClassName);


    console.log('All codegen steps complete.');


    return {
        interfaces: generatedInterfaces,
        services: generatedServices,
        controllerRoutes: generatedControllerRoutes
    };

}



// - - - - - - - - - - - - - - - - //


