export const PredefinedFunctionsCode = `export class ProgImgLoaderFunctions {

  /**
   * Returns a function that replaces a specified segment in a URL string.
   * @param searchValue The string or RegExp to search for.
   * @param replaceValue The string to replace the searchValue with.
   * @returns A function that takes a small image URL and returns a new URL string with the segment replaced.
   * 
   * Example: ProgImgLoaderFunctions.replaceSegment('placeholder', 'large')
   */
  public static replaceSegment(
    searchValue: string | RegExp, 
    replaceValue: string
  ): (smlImgUrl: string) => string {
    return (smlImgUrl: string) => smlImgUrl.replace(searchValue, replaceValue);
  }

  /**
   * Returns a function that removes a specified segment from a URL path.
   * @param segmentToRemove The segment to remove from the URL path.
   * @returns A function that takes a small image URL and returns a new URL with the segment removed.
   */
  public static removeFromPath(
    segmentToRemove: string
  ): (smlImgUrl: string) => string {
    return (smlImgUrl: string) => smlImgUrl.replace(segmentToRemove, '');
  }

  /**
   * Returns a function that replaces the suffix of a filename.
   * @param smallSuffix The suffix to replace in the filename (before extension).
   * @param largeSuffix The new suffix for the filename.
   * @returns A function that takes a small image URL and returns a URL with the suffix replaced.
   * 
   * Example: ProgImgLoaderFunctions.replaceFilenameSuffix('-small', '-large')
   */
  public static replaceFilenameSuffix(
    smallSuffix: string, 
    largeSuffix: string
  ): (smlImgUrl: string) => string {
    return (smlImgUrl: string) => {
      const lastDotIndex = smlImgUrl.lastIndexOf('.');
      if (lastDotIndex === -1) return smlImgUrl;
      
      const extension = smlImgUrl.substring(lastDotIndex);
      const filenameWithoutExt = smlImgUrl.substring(0, lastDotIndex);
      
      if (!filenameWithoutExt.endsWith(smallSuffix)) return smlImgUrl;
      
      return filenameWithoutExt.slice(0, -smallSuffix.length) + 
             largeSuffix + extension;
    };
  }
}`
