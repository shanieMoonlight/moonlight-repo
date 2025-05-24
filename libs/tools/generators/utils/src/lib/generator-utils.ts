import { Tree } from "@nx/devkit";
import path = require("path");

export class GeneratorUtils {
  /**
   * Joins tag strings with commas
   */
  static joinTags(tags: string[]): string {
    return tags
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .join(',');
  }

  
  //----------------------------//


  /**
   * Removes auto-generated component files from a library
   */
  static removeDefaultLibraryComponentFiles(tree: Tree, rootDirectory: string, libName: string): void {
    console.log('removeDefaultLibraryComponentFiles', rootDirectory, libName);
    
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

    // Delete each file if it exists
    filesToDelete.forEach(file => {
      if (tree.exists(file)) {
        tree.delete(file);
        console.log(`Deleted: ${file}`);
      }
    });
  }

  //----------------------------//


  /**
   * Adds custom ESLint rules to the generated eslint.config.mjs file
   */
  static addCustomEslintRules(tree: Tree, directory: string): void {
    const eslintConfigPath = `${directory}/eslint.config.mjs`;

    if (tree.exists(eslintConfigPath)) {
      let content = tree.read(eslintConfigPath, 'utf-8');

      if (!content) {
        console.error(`ESLint config file is empty or not readable: ${eslintConfigPath}`);
        return;
      }

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


  //----------------------------//


  /**
   * Find files that match a pattern in a directory (including subdirectories)
   */
  static findFilesByPattern(tree: Tree, directory: string, pattern: string): string[] {
    const matchingFiles: string[] = [];

    console.log(`Searching in directory: ${directory} for pattern: ${pattern}`);
    // Skip if directory doesn't exist
    if (!tree.exists(directory))
      return matchingFiles;

    // Get all children in the directory
    const children = tree.children(directory);

    for (const child of children) {
      const childPath = path.join(directory, child);

      if (tree.isFile(childPath)) {
        // If it's a file and matches the pattern, add it
        if (child.endsWith(pattern))
          matchingFiles.push(childPath);
      } else {
        // If it's a directory, search recursively
        const subDirMatches = GeneratorUtils.findFilesByPattern(tree, childPath, pattern);
        matchingFiles.push(...subDirMatches);
      }
    }

    return matchingFiles;
  }

  //----------------------------//


}//Cls