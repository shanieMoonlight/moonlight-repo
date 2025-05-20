export class ProgImgLoaderFunctions {

    /**
     * Returns a function that replaces a specified segment in a URL string.
     * @param searchValue The string or RegExp to search for.
     * @param replaceValue The string to replace the searchValue with.
     * @returns A function that takes a small image URL and returns a new URL string with the segment replaced.
     * Example: ProfgImgLoaderFunctions.replaceSegment('/small/', '/large/')
     */
    public static replaceSegment(searchValue: string | RegExp, replaceValue: string): (smlImgUrl: string) => string {
        return (smlImgUrl: string): string => {
            return smlImgUrl.replace(searchValue, replaceValue);
        };
    }

    //- - - - - - - - - - - - - - - //

    /**
     * Returns a function that removes a specified segment from a URL string's path.
     * This is a convenience function that uses \`replaceSegment\` with an empty replaceValue.
     * @param segmentToRemove The segment to remove from the URL path (e.g., 'placeholder/').
     * @returns A function that takes a small image URL and returns a new URL string with the segment removed.
     * Example: ProfgImgLoaderFunctions.removeFromPath('placeholder/')
     * // 'assets/images/placeholder/foo.jpg' -> 'assets/images/foo.jpg'
     */
    public static removeFromPath(segmentToRemove: string): (smlImgUrl: string) => string {
        // Ensure the segmentToRemove, if it's meant to be a directory, ends with a slash
        // or handle cases where it might inadvertently merge parts if not.
        // For simplicity, current implementation relies on exact string match.
        return ProgImgLoaderFunctions.replaceSegment(segmentToRemove, '');
    }

    //- - - - - - - - - - - - - - - //

    /**
     * Returns a function that replaces a suffix in the filename part of a URL.
     * Handles URLs with query parameters and hash fragments.
     * @param smallSuffix The suffix to find in the filename (e.g., '-thumb').
     * @param largeSuffix The suffix to replace the smallSuffix with (e.g., '-full').
     * @returns A function that takes a small image URL and returns a new URL string with the filename suffix replaced.
     * Example: ProfgImgLoaderFunctions.replaceFilenameSuffix('-small', '-large')
     * // 'path/to/image-small.jpg?v=1' -> 'path/to/image-large.jpg?v=1'
     * // 'image-small.jpg' -> 'image-large.jpg'
     * // 'path/image-small' -> 'path/image-large' (if no extension)
     */
    public static replaceFilenameSuffix(smallSuffix: string, largeSuffix: string): (smlImgUrl: string) => string {
        return (smlImgUrl: string): string => {
            let pathPart = smlImgUrl;
            let queryPart = '';
            let hashPart = '';

            const hashIndex = pathPart.indexOf('#');
            if (hashIndex !== -1) {
                hashPart = pathPart.substring(hashIndex);
                pathPart = pathPart.substring(0, hashIndex);
            }

            const queryIndex = pathPart.indexOf('?');
            if (queryIndex !== -1) {
                queryPart = pathPart.substring(queryIndex);
                pathPart = pathPart.substring(0, queryIndex);
            }

            const lastSlashIndex = pathPart.lastIndexOf('/');
            const filenamePartStart = lastSlashIndex === -1 ? 0 : lastSlashIndex + 1;
            const filenameWithExt = pathPart.substring(filenamePartStart);

            const lastDotIndexInFilename = filenameWithExt.lastIndexOf('.');

            let baseFilename: string;
            let extension: string;

            if (lastDotIndexInFilename === -1 || lastDotIndexInFilename === 0) { // No extension or filename starts with a dot (e.g. .htaccess)
                baseFilename = filenameWithExt;
                extension = '';
            } else {
                baseFilename = filenameWithExt.substring(0, lastDotIndexInFilename);
                extension = filenameWithExt.substring(lastDotIndexInFilename); // Includes the dot
            }

            if (baseFilename.endsWith(smallSuffix)) {
                const newBaseFilename = baseFilename.substring(0, baseFilename.length - smallSuffix.length) + largeSuffix;
                const newFilenameWithExt = newBaseFilename + extension;
                pathPart = pathPart.substring(0, filenamePartStart) + newFilenameWithExt;
            }

            return pathPart + queryPart + hashPart;
        };
    }

    //- - - - - - - - - - - - - - - //

    /**
     * Returns a function that changes the file extension in a URL.
     * Handles URLs with query parameters and hash fragments.
     * The new extension should include the leading dot (e.g., '.png').
     * If the URL does not have a recognizable extension in its filename, it remains unchanged.
     * @param newExtensionWithDot The new file extension, including the leading dot (e.g., '.webp').
     * @returns A function that takes a small image URL and returns a new URL string with the extension changed.
     * Example: ProfgImgLoaderFunctions.changeExtension('.webp')
     * // 'path/to/image.jpg?v=1' -> 'path/to/image.webp?v=1'
     * // 'image.jpeg' -> 'image.webp'
     * // '.configfile' -> '.newconfig' (if newExtensionWithDot is '.newconfig')
     */
    public static changeExtension(newExtensionWithDot: string): (smlImgUrl: string) => string {
        return (smlImgUrl: string): string => {
            if (!newExtensionWithDot || (newExtensionWithDot.length > 0 && !newExtensionWithDot.startsWith('.'))) {
                // Invalid new extension format, return original URL
                // Or console.warn for development? For now, silent return.
                return smlImgUrl;
            }

            let pathPart = smlImgUrl;
            let queryPart = '';
            let hashPart = '';

            const hashIndex = pathPart.indexOf('#');
            if (hashIndex !== -1) {
                hashPart = pathPart.substring(hashIndex);
                pathPart = pathPart.substring(0, hashIndex);
            }

            const queryIndex = pathPart.indexOf('?');
            if (queryIndex !== -1) {
                queryPart = pathPart.substring(queryIndex);
                pathPart = pathPart.substring(0, queryIndex);
            }

            const lastSlashIndex = pathPart.lastIndexOf('/');
            const lastDotIndex = pathPart.lastIndexOf('.');

            // Ensure the dot is part of the filename and not a directory name like 'my.folder/image'
            // Also handles filenames starting with a dot like '.bashrc'
            if (lastDotIndex > lastSlashIndex || (lastDotIndex === 0 && lastSlashIndex === -1)) {
                pathPart = pathPart.substring(0, lastDotIndex) + newExtensionWithDot;
            }
            // If no extension found in the filename part, or newExtensionWithDot is empty, it remains unchanged.

            return pathPart + queryPart + hashPart;
        };
    }


}//Cls