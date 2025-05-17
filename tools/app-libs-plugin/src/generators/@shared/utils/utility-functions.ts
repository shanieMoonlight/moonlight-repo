//------------------------------//

import { Tree } from "@nx/devkit";

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

/**
 * Adds custom ESLint rules to the generated eslint.config.mjs file
 */
export function addCustomEslintRules(tree: Tree, directory: string) {
  const eslintConfigPath = `${directory}/eslint.config.mjs`;
  
  if (tree.exists(eslintConfigPath)) {
    let content = tree.read(eslintConfigPath, 'utf-8');
    
    // Find the location to insert rules - after the component-selector rule
    const insertPosition = content.indexOf("'@angular-eslint/component-selector'");
    if (insertPosition !== -1) {
      // Find the end of the component-selector rule block
      const endOfComponentSelector = content.indexOf('},', insertPosition);
      const endOfRuleBlock = content.indexOf('    },', endOfComponentSelector);
      
      if (endOfRuleBlock !== -1) {
        // Insert custom rules before the rules object closing
        const customRules = `
      '@angular-eslint/no-input-rename': 'off',
      '@angular-eslint/no-output-rename': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off',`;
        
        content = content.slice(0, endOfRuleBlock) + customRules + content.slice(endOfRuleBlock);
        tree.write(eslintConfigPath, content);
        console.log(`Updated ESLint rules in: ${eslintConfigPath}`);
      }
    }
  }
}

//------------------------------//