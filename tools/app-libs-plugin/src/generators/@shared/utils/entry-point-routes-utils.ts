import { readProjectConfiguration, Tree } from "@nx/devkit";
import { GeneratorUtils } from "./generator-utils";
import path = require("path");
import { ClassImportUtils } from "./class-import-utils";

//##############################################//

const DefaultNewElementIndentation = '      ';

//##############################################//

export class EntryPointRoutesUtils {

    static addToRoutesArray(tree: Tree, routeDefsPathRelative: string, element: string) {

        console.log('addToRoutesArray called with ', routeDefsPathRelative, element);


        if (!tree.exists(routeDefsPathRelative)) {
            console.error(`File not found: ${routeDefsPathRelative}`);
            return;
        }

        if (!element.endsWith(','))
            element += ',';


        let updatedContent: string = undefined;
        const parentRouteDefsContent = tree.read(routeDefsPathRelative, 'utf-8');

        // Find the routes array definition
        // const routesArrayRegex = /export\s+const\s+\w+Routes\s*:\s*Route\[\]\s*=\s*\[([^]*?)\];/s;
        const routesArrayRegex = /export\s+const\s+\w+Routes\s*:\s*Route\[\]\s*=\s*\[([\s\S]*?)\];/;
        const routesMatch = routesArrayRegex.exec(parentRouteDefsContent);

        if (!routesMatch) {
            console.error(`Could not find routes array in ${routeDefsPathRelative}`);
            return ''
        }

        // Calculate the start position of the array content
        const arrayStartPos = routesMatch.index + routesMatch[0].indexOf('[') + 1;

        // Find the first object literal in the routes array (not a spread)
        // const firstObjectRegex = /\s*{[^}]*path\s*:/s;
        const firstObjectRegex = /\s*{[\s\S]*?path\s*:/;
        const objectMatch = firstObjectRegex.exec(routesMatch[1])


        if (!objectMatch) {
            console.error(`Could not find any route objects in the routes array`);
            return '';
        }

        console.log(`Found first object: ${objectMatch[0]}`);


        // Find the position of the first '{'
        const openBracePosition = objectMatch[0].indexOf('{');
        if (openBracePosition === -1) {
            console.error(`Could not find opening brace in object match`);
            return '';
        }

        // Insert our element before the first object (after all spreads)
        // The absolute position is array start + relative position of the object
        const insertPos = arrayStartPos + objectMatch.index + openBracePosition + 1;

        // Extract the indentation from the existing object
        const indentationMatch = /\n(\s*)/.exec(objectMatch[0]);
        const indentation = indentationMatch ? indentationMatch[1] : '  ';

        updatedContent =
            parentRouteDefsContent.substring(0, insertPos) +
            `\n${indentation}${element}\n` +
            parentRouteDefsContent.substring(insertPos);


        // Write the updated content back to the file
        tree.write(routeDefsPathRelative, updatedContent);
        console.log(`Added '${element}' to routes array in ${routeDefsPathRelative}`);

        return updatedContent;
    }

    //------------------------------//

    static findFileAddToRoutesArray(tree: Tree, entryPointRootPath: string, importStatement: string, routesArrayElement: string) {

        if (!entryPointRootPath)
            return;

        // Access the project by name
        try {

            const projectConfig = readProjectConfiguration(tree, entryPointRootPath);
            const parentEntryPointRoutesPath = path.join(projectConfig.sourceRoot, 'lib', 'routes');
            console.log(`Parent entry-point library path: ${parentEntryPointRoutesPath}`);


            // Find all entry-point.ts files in the directory
            const routesFiles = GeneratorUtils.findFilesByPattern(tree, parentEntryPointRoutesPath, 'routes.ts');


            if (routesFiles.length === 0) {
                console.error(`No route.ts files found in ${parentEntryPointRoutesPath}`);
                return;
            }

            // Use the first matching file or choose based on some criteria
            const routesFilesPath = routesFiles[0];
            console.log(`Found routes file: ${routesFilesPath}`);


            if (!tree.exists(routesFilesPath)) {
                console.error(`File ${routesFilesPath} does not exist in the project`);
                return;
            }



            console.log(`Adding import statement:  ${importStatement}`)
            let updatedParentEntryPointRoutesContent = undefined;
            if (importStatement) {
                updatedParentEntryPointRoutesContent = ClassImportUtils.addImportToClass(tree, routesFilesPath, importStatement);
                console.log(`Updated parent ${routesFilesPath} content: `, updatedParentEntryPointRoutesContent);
            }


            updatedParentEntryPointRoutesContent = EntryPointRoutesUtils.addToRoutesArray(tree, routesFilesPath, routesArrayElement);
            console.log(`*Updated parent ${routesFilesPath} content: `, updatedParentEntryPointRoutesContent);

            return updatedParentEntryPointRoutesContent;


        } catch (error) {

            console.error(`Project ${entryPointRootPath} not found in the workspace`);
            throw error

        }


    }

    //------------------------------//

    static findFileAndAddChildRoutes(tree: Tree, entryPointRootPath: string, importStatement: string, routesArrayElement: string) {

        // const parentEntryPoint = options.parentEntryPoint;
        if (!entryPointRootPath)
            return;

        // Access the project by name
        try {
            const projectConfig = readProjectConfiguration(tree, entryPointRootPath);

            const entryPointLibRoutesPath = path.join(projectConfig.sourceRoot, 'lib', 'routes');
            console.log(`Parent entry-point library path: ${entryPointLibRoutesPath}`);


            // Find all entry-point.ts files in the directory
            const routesFiles = GeneratorUtils.findFilesByPattern(tree, entryPointLibRoutesPath, 'routes.ts');


            if (routesFiles.length === 0) {
                console.error(`No route.ts files found in ${entryPointLibRoutesPath}`);
                return;
            }

            // Use the first matching file or choose based on some criteria
            const routesFilesPath = routesFiles[0];
            console.log(`Found routes file: ${routesFilesPath}`);


            if (!tree.exists(routesFilesPath)) {
                console.error(`File ${routesFilesPath} does not exist in the project`);
                return;
            }

            console.log(`Adding import statement:  ${importStatement}`);

            // console.log(`Updated parent ${routesFilesPath} content: `, updatedParentEntryPointRoutesContent);


            return this.addToRoutesArrayChildren(tree, routesFilesPath, routesArrayElement);
            // console.log(`*Updated parent ${routesFilesPath} content: `, updatedParentEntryPointRoutesContent);


        } catch (error) {
            console.error(`Project not found in the workspace: ${error.message}`);
            throw error; // Re-throwing might be too disruptive for a generator, consider logging and exiting.
        }

    }

    //------------------------------//

    static addToRoutesArrayChildren(tree: Tree, entryPointRoutesFilePath: string, element: string) {

        // console.log('addToRoutesArray called with ', entryPointRoutesFilePath, element);
        element = element.trim();

        if (!tree.exists(entryPointRoutesFilePath)) {
            console.error(`File not found: ${entryPointRoutesFilePath}`);
            return;
        }

        if (!element.endsWith(','))
            element += ',';

        const routeFileContent = tree.read(entryPointRoutesFilePath, 'utf-8');
        if (!routeFileContent) {
            console.error(`Could not read file content from ${entryPointRoutesFilePath}`);
            return;
        }

        const firstElementInArrayRegex = /:\s*Route\[]\s*=\s*\[\s*({(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})/;
        const firstElementMatch = firstElementInArrayRegex.exec(routeFileContent);

        if (!firstElementMatch || !firstElementMatch[1]) {
            console.error(`Could not find the first element of the Route[] array in ${entryPointRoutesFilePath}. Regex used: ${firstElementInArrayRegex}`);
            return undefined;
        }

        const firstObjectString = firstElementMatch[1];
        const firstObjectStartIndexInFile = firstElementMatch.index + firstElementMatch[0].indexOf(firstObjectString);

        const updatedFirstObjectString = this.updateChildrenArray(
            entryPointRoutesFilePath,
            element,
            firstObjectString);

        if (!updatedFirstObjectString) {
            console.error(`Error occurred in one of the handler methods Could add the element to the 'children' routes array.`);
            return undefined;
        }

        const updatedRouteFileContent =
            routeFileContent.substring(0, firstObjectStartIndexInFile) +
            updatedFirstObjectString +
            routeFileContent.substring(firstObjectStartIndexInFile + firstObjectString.length);

        tree.write(entryPointRoutesFilePath, updatedRouteFileContent);
        // console.log(`Added  ${updatedRouteFileContent}`);

        return updatedRouteFileContent;
    }

    //------------------------------//

    private static updateChildrenArray(entryPointRoutesFilePath: string, element: string, firstObjectString: string) {

        const childrenArrayRegex = /children\s*:\s*\[([\s\S]*?)\]/;
        const childrenMatch = childrenArrayRegex.exec(firstObjectString);

        if (childrenMatch && typeof childrenMatch[1] === 'string')
            return this.handleExistingChildren(firstObjectString, childrenMatch, element);

        console.warn(`'children' array not found in the first route object in ${entryPointRoutesFilePath}. Appending new children array.`);
        return this.handleNewChildren(firstObjectString, element);

    }

    //------------------------------//

    private static handleExistingChildren(
        firstObjectString: string,
        childrenMatch: RegExpExecArray,
        element: string
    ): string {

        let newElementIndentation = DefaultNewElementIndentation;
        // Index of 'children: [' within firstObjectString
        const childrenPropertyStartIndexInObject = childrenMatch.index;
        // Index of the opening '[' of the children array, relative to the start of firstObjectString
        const childrenArrayOpenBracketIndexInObject = childrenPropertyStartIndexInObject + childrenMatch[0].indexOf('[');

        // Determine indentation for the new element based on the 'children:' line
        const childrenLineStartIndex = firstObjectString.substring(0, childrenPropertyStartIndexInObject).lastIndexOf('\n') + 1;
        const childrenPropertyLineIndentationMatch = firstObjectString.substring(childrenLineStartIndex).match(/^(\s*)/);

        if (childrenPropertyLineIndentationMatch && childrenPropertyLineIndentationMatch[1])
            newElementIndentation = childrenPropertyLineIndentationMatch[1] + '  ';

        const newElementFormatted = `\n${newElementIndentation}${element}`;
        const insertPosInChildrenContent = childrenArrayOpenBracketIndexInObject + 1;

        return (
            firstObjectString.substring(0, insertPosInChildrenContent) +
            newElementFormatted +
            firstObjectString.substring(insertPosInChildrenContent)
        );
    }

    //------------------------------//

    private static handleNewChildren(firstObjectString: string, element: string): string | undefined {

        let newElementIndentation = DefaultNewElementIndentation;
        const lastPropertyMatch = /,\s*\n(\s*)}/.exec(firstObjectString);
        let insertChildrenPosInObject: number;
        let childrenIndentation = '    ';

        if (lastPropertyMatch && lastPropertyMatch[1]) {
            childrenIndentation = lastPropertyMatch[1];
            insertChildrenPosInObject = firstObjectString.lastIndexOf(lastPropertyMatch[0]) + 1;
        } else {
            insertChildrenPosInObject = firstObjectString.lastIndexOf('}');
            if (insertChildrenPosInObject === -1) {
                console.error("Could not find closing brace of the first object. Cannot add children array.");
                return undefined;
            }
            const objectContentForIndent = firstObjectString.substring(0, insertChildrenPosInObject);
            const lastNewline = objectContentForIndent.lastIndexOf('\n');
            if (lastNewline !== -1) {
                const indentMatch = objectContentForIndent.substring(lastNewline + 1).match(/^(\s*)/);
                if (indentMatch && indentMatch[1]) childrenIndentation = indentMatch[1];
            }
        }
        newElementIndentation = childrenIndentation + '  ';
        const newChildrenArrayString = this.createChildrenArrayString(childrenIndentation, newElementIndentation, element);

        return (
            firstObjectString.substring(0, insertChildrenPosInObject) +
            newChildrenArrayString +
            firstObjectString.substring(insertChildrenPosInObject)
        );
    }

    //------------------------------//

    private static createChildrenArrayString(childrenIndentation: string, newElementIndentation: string, element: string) {
        return `,\n${childrenIndentation}children: [\n${newElementIndentation}${element}\n${childrenIndentation}]`;
    }

}