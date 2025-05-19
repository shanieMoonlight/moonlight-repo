import { Tree } from "@nx/devkit";

export class ParentEntryPointLibUtils {

  static findEntryPointComponentName(tree: Tree, entryPointRoutesFilePath: string): string {

    if (!tree.exists(entryPointRoutesFilePath)) {
      console.error(`File ${entryPointRoutesFilePath} does not exist in the project`);
      return;
    }

    // Read the file content
    const routeFileContent = tree.read(entryPointRoutesFilePath, 'utf-8');

    // console.log(`entryPointRoutesFilePath: `, routeFileContent);

    // Regex 1: Find the Route[] array and capture the first element (object literal) as a string.
    // This regex looks for '... : Route[] = [ { /* first object content */ } ... ]'
    // Group 1 captures the first object: { /* content */ }
    const firstElementInArrayRegex = /:\s*Route\[]\s*=\s*\[\s*({(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})/; // Removed /s flag
    const firstElementMatch = firstElementInArrayRegex.exec(routeFileContent);


    if (!firstElementMatch || !firstElementMatch[1]) {
      console.error(`Could not find the first element of the Route[] array in ${entryPointRoutesFilePath}. Regex used: ${firstElementInArrayRegex}`);
      return undefined;
    }

    const firstObjectString = firstElementMatch[1];
    // console.log(`First object string found: \n`, firstObjectString);

    // Regex 2: Extract the component name from the captured firstObjectString.
    // This regex looks for 'component: ComponentName'
    // Group 1 captures the ComponentName.
    const componentPropertyRegex = /component\s*:\s*([A-Za-z_][\w]*)/;
    const componentMatch = componentPropertyRegex.exec(firstObjectString);

    if (!componentMatch || !componentMatch[1]) {
      console.error(`Could not find the 'component' property in the first route object: ${firstObjectString}. Regex used: ${componentPropertyRegex}`);
      return undefined;
    }

    const componentName = componentMatch[1];
    console.log(`Found component name: ${componentName} in ${entryPointRoutesFilePath}`);

    return componentName;
  }


}//Cls