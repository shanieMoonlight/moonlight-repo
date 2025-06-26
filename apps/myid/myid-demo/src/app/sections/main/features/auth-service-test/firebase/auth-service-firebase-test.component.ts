import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbFirebaseSignalService } from '@spider-baby/auth-signal/firebase';

@Component({
  selector: 'sb-auth-service-test',
  imports: [CommonModule],
  templateUrl: './auth-service-firebase-test.component.html',
  styleUrl: './auth-service-firebase-test.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthServiceFirebaseTestComponent {

  // protected _authService = inject(MyIdAuthService); // Replace with actual AuthService injection
  protected _authService = inject(SbFirebaseSignalService);



  isArray = (value: unknown) => Array.isArray(value)



}
