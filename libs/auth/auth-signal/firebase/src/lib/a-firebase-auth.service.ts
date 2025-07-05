import { Directive, computed } from '@angular/core';
import { BaseAuthSignalService } from '@spider-baby/auth-signal';
import { FirebaseJwtMetadata, FirebaseJwtPayload } from './firebase-jwt-payload';

/**
 * Abstract service for Firebase authentication, extending the base auth signal service.
 * Extend with specific JwtStorageService implementations for browser, ionic, etc environments.
 */

@Directive({})
export abstract class AFirebaseSignalService extends BaseAuthSignalService<FirebaseJwtPayload> {

  uid = computed(() => this.getClaimValue('uid'))
  firebaseMetadata = computed(() => this.getClaimValue('firebase') as FirebaseJwtMetadata | undefined);

} //Cls
