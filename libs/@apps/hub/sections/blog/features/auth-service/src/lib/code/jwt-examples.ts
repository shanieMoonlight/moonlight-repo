export const JwtPayloadCode = `export interface JwtPayload {
    // Registered Claims (some are technically optional in the spec, but often present in practice)
    iss?: string; // Issuer - highly recommended, almost always present
    sub: string;  // Subject - this is *almost always* required as it identifies the principal
    aud?: string | string[]; // Audience - can be a string or array of strings, often present
    exp?: number; // Expiration Time - highly recommended, almost always present
    nbf?: number; // Not Before - optional
    iat?: number; // Issued At Time - optional but very common
    jti?: string; // JWT ID - optional
    
    // OpenID Connect Standard Claims (from 'profile', 'email', 'address' scopes)
    name?: string;           // Full name
    given_name?: string;     // Given name(s) or first name(s)
    family_name?: string;    // Surname(s) or last name(s)
    email?: string;          // Preferred email address
    email_verified?: boolean; // True if the End-User's e-mail address has been verified
    picture?: string;        // URL of the profile picture
    locale?: string;         // End-User's preferred locale
    auth_time?: number;      // Time when the End-User authentication occurred (NumericDate)
    
    // Other less common but still standard OIDC claims
    updated_at?: string;     // Time the End-User's information was last updated (ISO 8601 string)
    birthdate?: string;      // Birthday (YYYY-MM-DD format)
    gender?: string;         // Gender
    address?: {              // The address claim is typically an object in OIDC
        formatted?: string;
        street_address?: string;
        locality?: string;
        region?: string;
        postal_code?: string;
        country?: string;
    };
    // If you need other OIDC claims like phone_number, zoneinfo, etc., you'd add them here
    // phone_number?: string;
    // phone_number_verified?: boolean;
    // zoneinfo?: string;
    profile?: string; // URL of the End-User's profile page
    website?: string; // URL of the End-User's Web page or blog
    
    role?: string | string[]; // Permissions/roles
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
    
    if (typeof window !== 'undefined' && typeof window.atob === 'function') 
        return decodeURIComponent(encodeURI(window.atob(output)));
     else if (typeof Buffer !== 'undefined') 
        return Buffer.from(output, 'base64').toString('utf-8');
     else 
        throw new Error('No base64 decoder available in this environment');
    
  }

  
  static decodeToken(token: string) {
    if (!token) 
        throw new Error('JWT must not be null');
    
    const parts = token.split('.');

    if (parts.length !== 3) 
        throw new Error('JWT must have 3 parts');

    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) 
        throw new Error('Cannot decode the token');
    
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
      if (!decodedToken?.exp || decodedToken.exp < now) 
        return true;

      if (decodedToken?.nbf && decodedToken.nbf > now) 
        return true;
      
      return false;

    } catch { 
     return true; 
    }
  }
}`;


export const CustomJwtPayloadCode0 = `interface CustomPayload extends JwtPayload {
  customField: string;
  permissions: string[];
}

export class CustomAuthService extends BaseAuthSignalService<CustomPayload>{
  // Your implementation
}`;

export const CustomJwtPayloadCode = `

export interface FirebaseJwtMetadata {
    identities?: { [providerId: string]: string[] }; // e.g., {'google.com': ['user@gmail.com'], 'email': ['user@example.com']}
    sign_in_provider?: string; // e.g., 'password', 'google.com', 'phone'
    tenant?: string; // For multi-tenancy
    [key: string]: any; // Custom claims or other Firebase-internal properties
}




export interface FirebaseJwtPayload extends JwtPayload {
    // Firebase Specific Claims
    uid: string; // The Firebase User ID, always present and typically matches 'sub'
    firebase?: FirebaseJwtMetadata;

}


/**
 * Abstract service for Firebase authentication, extending the base auth signal service.
 * Extend with specific JwtStorageService implementations for browser, ionic, etc environments.
 */
@Directive({})
export abstract class AFirebaseSignalService extends BaseAuthSignalService<FirebaseJwtPayload> {

  uid = computed(() => this.getClaimValue('uid'))
  firebaseMetadata = computed(() => this.getClaimValue('firebase') as FirebaseJwtMetadata | undefined);

} //Cls

`;
