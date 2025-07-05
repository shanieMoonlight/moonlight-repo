/* eslint-disable @typescript-eslint/no-explicit-any */

import { JwtPayload } from "@spider-baby/auth-signal";

//#############################//

export interface FirebaseJwtMetadata {
    identities?: { [providerId: string]: string[] }; // e.g., {'google.com': ['user@gmail.com'], 'email': ['user@example.com']}
    sign_in_provider?: string; // e.g., 'password', 'google.com', 'phone'
    tenant?: string; // For multi-tenancy
    [key: string]: any; // Custom claims or other Firebase-internal properties
}

//#############################//

export interface FirebaseJwtPayload extends JwtPayload {
    // Firebase Specific Claims
    uid: string; // The Firebase User ID, always present and typically matches 'sub'
    firebase?: FirebaseJwtMetadata;

}

//#############################//