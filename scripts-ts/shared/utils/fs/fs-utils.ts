import * as fs from 'fs';
import * as path from 'path';
import { FileInfo } from './fs-models';

/**
 * Utility class for common file and directory operations, both sync and async.
 */
export class FsUtils {
    /**
     * Checks if a file exists.
     * @param filePath Path to the file.
     * @returns True if the file exists, false otherwise.
     */
    static fileExists = (filePath: string): boolean =>
        fs.existsSync(filePath)

    //----------------------------//

    /**
     * Checks if a directory exists.
     * @param dirPath Path to the directory.
     * @returns True if the directory exists, false otherwise.
     */
    static dirExists = (dirPath: string): boolean =>
        fs.existsSync(dirPath) && fs.lstatSync(dirPath)
            .isDirectory()

    //----------------------------//

    /**
     * Creates a directory if it does not exist.
     * @param localNpmDir Path to the directory to create.
     */
    static createDirIfNotExists(localNpmDir: string): void {
        if (fs.existsSync(localNpmDir))
            return
        console.log(`${localNpmDir} does not exist. Creating  ...`);
        fs.mkdirSync(localNpmDir, { recursive: true })
    }

    //----------------------------//

    /**
     * Gets all files in the current directory with the given extension (sync).
     * @param extension File extension (e.g. '.tgz').
     * @param dir Directory to search (default: current directory).
     * @returns Array of full file paths.
     */
    static getFilesInDirectoryByExtension(extension: string, dir: string = '.'): string[] {
        if (!extension.startsWith('.'))
            extension = `.${extension}`
        return fs.readdirSync('.')
            .filter(f => f.endsWith(extension))
            .map(f => path.join(dir, f))
    }

    //- - - - - - - - - - - - - - //

    /**
     * Gets all files in the current directory with the given extension (async).
     * @param extension File extension (e.g. '.tgz').
     * @param dir Directory to search (default: current directory).
     * @returns Promise of array of full file paths.
     */
    static async getFilesInDirectoryByExtensionAsync(extension: string, dir: string = '.'): Promise<string[]> {
        if (!extension.startsWith('.'))
            extension = `.${extension}`
        return (await fs.promises.readdir('.'))
            .filter(f => f.endsWith(extension))
            .map(f => path.join(dir, f))
    }

    //----------------------------//

    /**
     * Gets all files in a directory matching a search function (sync).
     * @param dir Directory to search.
     * @param searchFn Function to filter filenames.
     * @returns Array of filenames.
     */
    static getFilesInDirectory = (dir: string, searchFn: (filname: string) => boolean) =>
        fs.readdirSync(dir)
            .filter(searchFn)

    //- - - - - - - - - - - - - - //

    /**
     * Gets all files in a directory matching a search function (async).
     * @param dir Directory to search.
     * @param searchFn Function to filter filenames.
     * @returns Promise of array of filenames.
     */
    static async getFilesInDirectoryAsync(dir: string, searchFn: (filename: string) => boolean): Promise<string[]> {
        const files = await fs.promises.readdir(dir);
        return files.filter(searchFn);
    }

    //----------------------------//

    /**
     * Gets file info (name, modified time, full path) for files in a directory matching a search function (sync).
     * @param dir Directory to search.
     * @param searchFn Function to filter filenames.
     * @returns Array of FileInfo objects.
     */
    static getFilesInformationDirectory = (dir: string, searchFn: (filname: string) => boolean): FileInfo[] =>
        FsUtils.getFilesInDirectory(dir, searchFn)
            .map(f => ({
                name: f,
                modifiedTime: fs.statSync(path.join(dir, f)).mtime.getTime(),
                fullPath: path.join(dir, f)
            }))
            .sort((a, b) => b.modifiedTime - a.modifiedTime)

    //- - - - - - - - - - - - - - //

    /**
     * Gets file info (name, modified time, full path) for files in a directory matching a search function (async).
     * @param dir Directory to search.
     * @param searchFn Function to filter filenames.
     * @returns Promise of array of FileInfo objects.
     */
    static async getFilesInformationDirectoryAsync(dir: string, searchFn: (filename: string) => boolean): Promise<FileInfo[]> {
        const files = await FsUtils.getFilesInDirectoryAsync(dir, searchFn);
        const infos = await Promise.all(files.map(async f => ({
            name: f,
            modifiedTime: (await fs.promises.stat(path.join(dir, f))).mtime.getTime(),
            fullPath: path.join(dir, f)
        })));
        return infos.sort((a, b) => b.modifiedTime - a.modifiedTime);
    }

    //----------------------------//

    /**
     * Moves a file from srcFile to destFile (sync).
     * @param srcFile Source file path.
     * @param destFile Destination file path.
     */
    static moveFile(srcFile: string, destFile: string): void {
        if (!fs.existsSync(srcFile))
            throw new Error(`Source file does not exist: ${srcFile}`);
        fs.renameSync(srcFile, destFile);
    }

    //- - - - - - - - - - - - - - //

    /**
     * Moves a file from srcFile to destFile (async).
     * @param srcFile Source file path.
     * @param destFile Destination file path.
     * @returns Promise that resolves when the move is complete.
     */
    static async moveFileAsync(srcFile: string, destFile: string): Promise<void> {
        try {
            await fs.promises.rename(srcFile, destFile);
        } catch (err) {
            throw new Error(`Failed to move file from ${srcFile} to ${destFile}: ${err}`);
        }
    }

    //----------------------------//

    /**
     * Moves multiple files to a directory (sync).
     * @param srcFiles Array of source file paths.
     * @param destDir Destination directory.
     */
    static moveFilesToDirectory(srcFiles: string[], destDir: string): void {
        for (const file of srcFiles) {
            const src = path.resolve(file);
            const dest = path.join(destDir, path.basename(file));
            FsUtils.moveFile(src, dest);
        }
    }

    //- - - - - - - - - - - - - - //

    /**
     * Moves multiple files to a directory (async).
     * @param srcFiles Array of source file paths.
     * @param destDir Destination directory.
     * @returns Promise that resolves when all moves are complete.
     */
    static async moveFilesToDirectoryAsync(srcFiles: string[], destDir: string): Promise<void> {
        for (const file of srcFiles) {
            const src = path.resolve(file);
            const dest = path.join(destDir, path.basename(file));
            await FsUtils.moveFileAsync(src, dest);
        }
    }

    //----------------------------//

}//Cls