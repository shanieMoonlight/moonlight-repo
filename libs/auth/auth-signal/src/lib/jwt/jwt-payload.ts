export interface JwtPayload {
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
}