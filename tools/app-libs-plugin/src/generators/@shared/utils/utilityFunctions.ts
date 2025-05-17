//------------------------------//

import { Tree } from "@nx/devkit";
import { NoramlizedSectionGeneratorSchema } from "../schema/schema";

export const joinTags = (tags: string[]) => tags
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .join(',');

//------------------------------//


/**
 * Removes auto-generated component files from a library
 */
export function removeDefaultLibraryComponentFiles(tree: Tree, rootDirectory: string, libName: string) {
    // Extract the component name from the library name (convert to camelCase)
    const componentName = libName;

    // Base directory where the component files are located
    const libDir = `${rootDirectory}/src/lib`;

    // Component files to delete
    const filesToDelete = [
        `${libDir}/${componentName}/${componentName}.component.html`,
        `${libDir}/${componentName}/${componentName}.component.ts`,
        `${libDir}/${componentName}/${componentName}.component.spec.ts`,
        `${libDir}/${componentName}/${componentName}.component.scss`,
        // Also delete the component folder if it's empty
        `${libDir}/${componentName}`
    ];

    // console.log(`filesToDelete:`, filesToDelete);


    // Delete each file if it exists
    filesToDelete.forEach(file => {
        if (tree.exists(file)) {
            tree.delete(file);
            console.log(`Deleted: ${file}`);
        }
    })

}


//------------------------------//

// filesToDelete: [
//   'blog/src/lib/sb-hub-blog-entry-point/sb-hub-blog-entry-point.component.html',
//   'blog/src/lib/sb-hub-blog-entry-point/sb-hub-blog-entry-point.component.ts',
//   'blog/src/lib/sb-hub-blog-entry-point/sb-hub-blog-entry-point.component.spec.ts',
//   'blog/src/lib/sb-hub-blog-entry-point/sb-hub-blog-entry-point.component.scss',
//   'blog/src/lib/sb-hub-blog-entry-point'
// ]