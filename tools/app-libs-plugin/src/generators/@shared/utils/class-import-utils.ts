import { Tree } from "@nx/devkit";

export class ClassImportUtils {

  static addImportToClass(tree: Tree, parentRouteDefsPathRelative: string, importStatement: string,): string {

    if (!tree.exists(parentRouteDefsPathRelative)) {
      console.error(`File ${parentRouteDefsPathRelative} does not exist in the project`);
      return;
    }

    // Read the file content
    let updatedContent = ''
    const parentRouteDefsContent = tree.read(parentRouteDefsPathRelative, 'utf-8');

    // Find the last import statement
    const importRegex = /^import .+ from .+;(\r?\n)/gm;
    let lastImportEndPosition = 0;
    let match: RegExpExecArray | null;

    // Find the position of the last import statement
    while ((match = importRegex.exec(parentRouteDefsContent)) !== null) {
      lastImportEndPosition = match.index + match[0].length;
    }


    if (lastImportEndPosition < 1) {
      console.error('Could not find import statements in the file');
      return updatedContent;
    }

    // Insert the new import statement after the last import
    updatedContent =
      parentRouteDefsContent.substring(0, lastImportEndPosition) +
      importStatement + '\n' +
      parentRouteDefsContent.substring(lastImportEndPosition)

    // Write the updated content back to the file
    tree.write(parentRouteDefsPathRelative, updatedContent);
    console.log(`Added import statement to ${parentRouteDefsPathRelative}`)

    return updatedContent;
  }


  //------------------------------//

}//Cls