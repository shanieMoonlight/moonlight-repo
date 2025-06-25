export class StringHelpers {

  /**
   * Returns a copy of the input string, or an empty string if input is null or undefined.
   * @param oldString The string to clone.
   * @returns A new string copy, or '' if input is null/undefined.
   */
  static clone = (oldString?: string | null): string => `${oldString ?? ''}`

  //-------------------//

  /**
   * Checks if a string is null, undefined, empty, or contains only whitespace.
   * @param str The string to check.
   * @returns True if the string is null, undefined, empty, or whitespace only.
   */
  static isNullOrWhitespace = (str?: string | null): boolean =>
    !str || str.match(/^ *$/) !== null;

  //-------------------//

  /**
   * Type guard: checks if a value is a string (primitive or String object).
   * @param x The value to check.
   * @returns True if x is a string.
   */
  static isString = (x: unknown): x is string =>
    typeof x === 'string' || x instanceof String;

  //-------------------//

  /**
   * Removes all whitespace characters from a string and trims the result.
   * @param str The string to process.
   * @returns The string with all whitespace removed.
   */
  static removeWhitespace = (str: string): string =>
    str.replace(/\s+/g, '').trim();

  //-------------------//

  /**
   * Converts a dashed or camel-cased string to title case, removing dashes and capitalizing each word.
   * Example: 'foo-barBaz' -> 'Foo Bar Baz'
   * @param originalString The string to convert.
   * @returns The title-cased string.
   */
  static dashedToTitleCase(originalString?: string): string {
    if (!originalString) return originalString ?? '';

    const strArray = originalString.split(/(?=[A-Z-])/).join(' ')

    return strArray.split(' ')
      .map(str => str.replace('-', ''))
      .filter(str => !!str)
      .map(str => str[0].toUpperCase() + str.slice(1))
      .join(' ')
  }

  //-------------------//

  /**
   * Converts a camel-cased string to title case, splitting on uppercase letters.
   * Example: 'fooBarBaz' -> 'Foo Bar Baz'
   * @param originalString The string to convert.
   * @returns The title-cased string.
   */
  static toTitleCase(originalString?: string): string {
    if (!originalString) return originalString ?? '';

    const regex = /(?=[A-Z])/;
    const strArray = originalString.split(regex).join(' ')

    if (!strArray.length)
      return ''
    return strArray[0].toUpperCase() + strArray.slice(1);
  }

  //-------------------//

  /**
   * Converts a camel-cased or dashed string to title case, optionally removing dashes.
   * Example: 'foo-barBaz' -> 'Foo Bar Baz' (removeDashes=true)
   * @param originalString The string to convert.
   * @param removeDashes If true, removes dashes from the result.
   * @returns The title-cased string.
   */
  static toTitleCases(originalString?: string, removeDashes?: boolean): string {
    if (!originalString) return originalString ?? '';

    const regex = removeDashes ? /(?=[A-Z-])/ : /(?=[A-Z])/;
    const strArray = originalString.split(regex).join(' ')

    return strArray.split(' ')
      .map(str => removeDashes ? str.replace('-', '') : str)
      .filter(str => !!str)
      .map(str => str[0].toUpperCase() + str.slice(1))
      .join(' ')
  }

  //-------------------//

  /**
   * Truncates a string to a maximum length and adds an ellipsis (…)
   * if the string was truncated and useElipses is true.
   * @param originalStr The string to truncate.
   * @param maxLength The maximum length before truncation (default: 25).
   * @param useElipses Whether to add an ellipsis if truncated (default: true).
   * @returns The truncated string, possibly with an ellipsis.
   */
  static truncate(
    originalStr?: string,
    maxLength: number = 25,
    useElipses: boolean = true
  ): string {

    if (!originalStr) return originalStr ?? '';

    const trail = useElipses ? '…' : '';

    if (originalStr.length > maxLength)
      return originalStr.substring(0, maxLength) + trail;
    else
      return originalStr
  }

} //Cls
