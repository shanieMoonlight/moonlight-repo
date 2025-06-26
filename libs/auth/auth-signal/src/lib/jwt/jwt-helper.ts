export class JwtHelper {

  private static urlBase64Decode(str: string) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');

    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string!');
    }

    // Universal base64 decode
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      // Browser
      return decodeURIComponent(encodeURI(window.atob(output)));
    } else if (typeof Buffer !== 'undefined') {
      // Node.js
      return Buffer.from(output, 'base64').toString('utf-8');
    } else {
      throw new Error('No base64 decoder available in this environment');
    }
  }

  //-------------------//

  static decodeToken(token: string) {

    if (!token)
      throw new Error('JWT must not be null');

    const parts = token.split('.');
    if (parts.length !== 3)
      throw new Error('JWT must have 3 parts')

    const decoded = this.urlBase64Decode(parts[1]);

    if (!decoded)
      throw new Error('Cannot decode the token')

    return JSON.parse(decoded)

  }

  //-------------------//

  /**
   * Tells if the raw token is expierd
   * @param rawToken Token in base64 form
   */
  static isRawTokenExpired(rawToken: string): boolean {

    try {
      const decoded = this.decodeToken(rawToken);
      return this.isTokenExpired(decoded)
    } catch {
      //Any error means we can't trust the token
      return true
    }

  }

  //-------------------//

  /**
   * Tells if the token is expierd
   * @param decodedToken Decoded Token (NOT base64 form)
   */
  static isTokenExpired(decodedToken: any): boolean {

    try {
      const now = Date.now().valueOf() / 1000;
      // if (!decodedToken?.exp || !decodedToken?.nbf) return true;
      //Token should have expiry
      if (!decodedToken?.exp || decodedToken.exp < now) return true;
      //Token may not have notBefore
      if (decodedToken?.nbf && decodedToken.nbf > now) return true;
      return false
    } catch {
      //Any error means we can't trust the token
      return true
    }

  }

} //Cls
