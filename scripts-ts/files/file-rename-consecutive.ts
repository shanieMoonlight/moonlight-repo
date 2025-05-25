import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Simple file renamer - works on any file type
 * Renames all files in a directory consecutively: newName1.ext, newName2.ext, etc.
 */
export class SimpleFileRenamer {

  /**
   * Rename all files in a directory consecutively
   * @param dir - containing directory path
   * @param newName - new name base (without extension)
   */
  static async renameFiles(dir: string, newName: string): Promise<void> {
    try {
      // Validate directory exists
      const stats = await fs.stat(dir);
      if (!stats.isDirectory()) {
        throw new Error(`"${dir}" is not a directory.`);
      }

      // Read all files in directory
      const files = await fs.readdir(dir);
      
      // Filter out directories, keep only files
      const fileEntries = await Promise.all(
        files.map(async (file) => {
          const fullPath = path.join(dir, file);
          const stat = await fs.stat(fullPath);
          return stat.isFile() ? fullPath : null;
        })
      );
      
      const actualFiles = fileEntries.filter(Boolean) as string[];
      
      if (actualFiles.length === 0) {
        console.log(`📂 No files found in "${dir}".`);
        return;
      }

      console.log(`📁 Found ${actualFiles.length} file(s) to rename in "${dir}"`);
      
      // Create counter = 1
      let counter = 1;
      
      // Iterate through the files in the folder
      for (const fullFilePathWithExt of actualFiles) {
        // Find extension
        const ext = this.functionToFindExt(fullFilePathWithExt);
        
        // Create new filename: dir + '/' + newName + counter++ + '.' + ext
        const newFileName = path.join(dir, `${newName}${counter}.${ext}`);
        
        // Check if target already exists
        try {
          await fs.access(newFileName);
          console.warn(`⚠️  Warning: "${path.basename(newFileName)}" already exists, skipping "${path.basename(fullFilePathWithExt)}"`);
          continue;
        } catch {
          // File doesn't exist, proceed with rename
        }
        
        // Save/move the file with its new name
        await fs.rename(fullFilePathWithExt, newFileName);
        
        console.log(`✅ Renamed: "${path.basename(fullFilePathWithExt)}" → "${path.basename(newFileName)}"`);
        counter++;
      }
      
      console.log(`🎉 Successfully renamed ${counter - 1} file(s).`);
      
    } catch (error) {
      console.error(`❌ Error: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Function to find extension from full file path
   * @param fullFilePathWithExt - full path to file
   * @returns extension without the dot
   */
  private static functionToFindExt(fullFilePathWithExt: string): string {
    const ext = path.extname(fullFilePathWithExt);
    return ext.startsWith('.') ? ext.substring(1) : ext;
  }
}

/**
 * CLI interface
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.log(`
📁 Simple File Renamer

Usage: npx ts-node -P tsconfig.scripts.json scripts-ts/files/file-rename-consecutive.ts <dir> <newName>

Arguments:
  dir       Directory path containing files to rename
  newName   New base name for files (without extension)

Example:
  npx ts-node -P tsconfig.scripts.json scripts-ts/files/file-rename-consecutive.ts ./images/blog/mini-state mini-state

Result:
  Files will be renamed as: mini-state1.jpg, mini-state2.png, mini-state3.txt, etc.
`);
    process.exit(1);
  }

  const [dir, newName] = args;
  
  try {
    console.log(`🚀 Starting file rename operation...`);
    console.log(`📁 Directory: ${path.resolve(dir)}`);
    console.log(`🏷️  New name: ${newName}`);
    console.log('');

    await SimpleFileRenamer.renameFiles(path.resolve(dir), newName);
    
  } catch (error) {
    console.error(`❌ Failed: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

//npx ts-node -P tsconfig.scripts.json  C:\Users\Shaneyboy\VsCode\moonlight-repo\scripts-ts\files\file-rename-consecutive.ts C:\Users\Shaneyboy\Desktop\mini-state mini-state