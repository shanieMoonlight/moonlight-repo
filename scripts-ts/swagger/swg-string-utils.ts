
export class SwgStringUtils {


  static capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // - - - - - - - - - - - - - - - - //

  static toCamelCase(str: string) {
    return str.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, (m) => m.toLowerCase());
  }

  // - - - - - - - - - - - - - - - - //
  
  static interfaceFilename(name: string) {
    return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase() + '.ts';
  }
  
  // - - - - - - - - - - - - - - - - //
  
  static classNameToFilename(className: string) {
    return className.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase() + '.ts';
  }
  
  
}//Cls