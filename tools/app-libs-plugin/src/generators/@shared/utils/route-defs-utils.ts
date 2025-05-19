import { readProjectConfiguration, Tree } from "@nx/devkit";
import { GeneratorUtils } from "./generator-utils";
import path = require("path");

//##############################################//

export class RouteDefsUtils {

    static findFileAndAddChildRoute(tree: Tree, routeDefsPath: string, childRoute: string) {

        // const parentEntryPoint = options.parentEntryPoint;
        if (!routeDefsPath)
            return;

        // Access the project by name
        try {
            const projectConfig = readProjectConfiguration(tree, routeDefsPath);

            const routeDefsLibPath = path.join(projectConfig.sourceRoot, 'lib');

            // Find all entry-point.ts files in the directory
            const routeDefsFiles = GeneratorUtils.findFilesByPattern(tree, routeDefsLibPath, 'route-defs.ts');


            if (routeDefsFiles.length === 0) {
                console.error(`No route.ts files found in ${routeDefsLibPath}`);
                return;
            }

            // Use the first matching file or choose based on some criteria
            const routesFilesPath = routeDefsFiles[0];
            console.log(`Found routes file: ${routesFilesPath}`);


            if (!tree.exists(routesFilesPath)) {
                console.error(`File ${routesFilesPath} does not exist in the project`);
                return;
            }


            return this.addChildRoute(tree, routesFilesPath, childRoute);


        } catch (error) {
            console.error(`Project not found in the workspace: ${error.message}`);
            throw error; // Re-throwing might be too disruptive for a generator, consider logging and exiting.
        }

    }


    //------------------------------//

    private static addChildRoute(tree: Tree, routesFilesPath: string, childRoute: string) {

        const routeDefsFileContent = tree.read(routesFilesPath, 'utf-8');
        if (!routeDefsFileContent) {
            console.error(`Could not read file content from ${routesFilesPath}`);
            return;
        }

        // Regex to find the CHILD_ROUTE type alias and capture its existing routes.
        // It looks for 'type CHILD_ROUTE = ' followed by the routes (group 1) and a semicolon.
        // The routes can be single quoted strings separated by '|'.
        const childRouteTypeRegex = /type\s+CHILD_ROUTE\s*=\s*([^;]+);/;
        const match = childRouteTypeRegex.exec(routeDefsFileContent);
        let updatedFileContent: string;

        if (match && match[1]) {
            const existingRoutes = match[1].trim(); // e.g., "'home'|'route-defs-tutorial'"

            // Check if the childRoute already exists to avoid duplicates
            // Simple string check, might need more robust parsing for complex cases
            if (existingRoutes.includes(`'${childRoute}'`)) {
                console.log(`Child route '${childRoute}' already exists in CHILD_ROUTE in ${routesFilesPath}. No changes made.`);
                return;
            }

            const newRouteSegment = `'${childRoute}'`;
            let updatedRoutes: string;

            if (existingRoutes === '') { // Should not happen if type is valid, but good to check
                updatedRoutes = newRouteSegment;
            } else {
                updatedRoutes = `${existingRoutes} | ${newRouteSegment}`;
            }

            const updatedChildRouteType = `type CHILD_ROUTE = ${updatedRoutes};`;

            updatedFileContent = routeDefsFileContent.replace(match[0], updatedChildRouteType);

            tree.write(routesFilesPath, updatedFileContent);
            console.log(`Appended '${childRoute}' to CHILD_ROUTE in ${routesFilesPath}`);

        } else {
            console.error(`Could not find 'type CHILD_ROUTE = ...;' definition in ${routesFilesPath}`);
        }

        return updatedFileContent;
    }

    //-------------------------------//

}