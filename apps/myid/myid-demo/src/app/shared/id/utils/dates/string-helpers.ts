
export class StringHelpers {

  /**
   * Creates a copy of @param oldString and return it.
   */
  static clone = (oldString?: string | null): string => `${oldString ?? ''}`

  //-------------------//

  /**
   * Checks if we have a blank or null String
   */
  static isNullOrWhitespace = (str: string): boolean =>
    str === null || str.match(/^ *$/) !== null;

  //-------------------//

  static isString = (x: any) => typeof x === 'string' || x instanceof String;

  //-------------------//

  /**
   * Removes all whitespace from String
   */
  static removeWhitespace = (str: string): string =>
    str.replace(/\s+/g, '').trim();

  //-------------------//

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

  static toTitleCase(originalString?: string): string {
    if (!originalString) return originalString ?? '';

    const regex = /(?=[A-Z])/
    const strArray = originalString.split(regex).join(' ')

    if (!strArray.length)
      return ''
    return strArray[0].toUpperCase() + strArray.slice(1);
  }

  //-------------------//


  static toTitleCases(originalString?: string, removeDashes?: boolean): string {
    if (!originalString) return originalString ?? '';

    const regex = removeDashes ? /(?=[A-Z-])/ : /(?=[A-Z])/
    const strArray = originalString.split(regex).join(' ')

    return strArray.split(' ')
      .map(str => removeDashes ? str.replace('-', '') : str)
      .filter(str => !!str)
      .map(str => str[0].toUpperCase() + str.slice(1))
      .join(' ')

  }

  //-------------------//

  /**
   * Truncates string and adds elipses if required
   * @param originalStr string to be truncated
   * @param maxLength maximum length of truncated string (before elipses): default = 25
   * @param useElipses Add elipses to result if the string was truncated: default = true
   */
  static truncate(
    originalStr?: string,
    maxLength: number = 25,
    useElipses: boolean = true
  ): string {

    if (!originalStr) return originalStr ?? '';

    const trail = useElipses ? '...' : ''

    if (originalStr.length > maxLength)
      return originalStr.substring(0, maxLength) + trail;
    else
      return originalStr

  } 

  //-------------------//

  /**
   *
   * @param num Pad the start of number/string with paddingChar's
   * @param size max string length
   * @param paddingChar what to pad with
   * @returns
   */
  static pad(num: number | string, size: number, paddingChar: string = '0') {
    if (!num) num = ''

    num = num.toString();

    while (num.length < size) num = `${paddingChar}${num}`;

    return num;
  } 
  
} //Cls
