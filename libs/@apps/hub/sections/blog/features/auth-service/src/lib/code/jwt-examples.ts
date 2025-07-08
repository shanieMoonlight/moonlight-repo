export const JwtPayloadCode = `export interface JwtPayload {
    iss?: string;
    sub: string;
    aud?: string | string[];
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    email?: string;
    email_verified?: boolean;
    picture?: string;
    locale?: string;
    auth_time?: number;
    updated_at?: string;
    birthdate?: string;
    gender?: string;
    address?: {
        formatted?: string;
        street_address?: string;
        locality?: string;
        region?: string;
        postal_code?: string;
        country?: string;
    };
    profile?: string;
    website?: string;
    role?: string | string[];
}`;

export const JwtHelperCode = `export class JwtHelper {
  private static urlBase64Decode(str: string) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: break;
      case 2: output += '=='; break;
      case 3: output += '='; break;
      default: throw new Error('Illegal base64url string!');
    }
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      return decodeURIComponent(encodeURI(window.atob(output)));
    } else if (typeof Buffer !== 'undefined') {
      return Buffer.from(output, 'base64').toString('utf-8');
    } else {
      throw new Error('No base64 decoder available in this environment');
    }
  }
  
  static decodeToken(token: string) {
    if (!token) throw new Error('JWT must not be null');
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('JWT must have 3 parts');
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) throw new Error('Cannot decode the token');
    return JSON.parse(decoded);
  }
  
  static isRawTokenExpired(rawToken: string): boolean {
    try {
      const decoded = this.decodeToken(rawToken);
      return this.isTokenExpired(decoded);
    } catch { return true; }
  }
  
  static isTokenExpired(decodedToken: any): boolean {
    try {
      const now = Date.now().valueOf() / 1000;
      if (!decodedToken?.exp || decodedToken.exp < now) return true;
      if (decodedToken?.nbf && decodedToken.nbf > now) return true;
      return false;
    } catch { return true; }
  }
}`;


export const CustomJwtPayloadCode = `interface CustomPayload extends JwtPayload {
  customField: string;
  permissions: string[];
}

export class CustomAuthService extends BaseAuthSignalService<CustomPayload>{
  // Your implementation
}`
 
;
