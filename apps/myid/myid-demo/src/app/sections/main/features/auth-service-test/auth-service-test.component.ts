import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyIdAuthService } from '../../../../shared/auth/services/auth/myid-auth.browser.service';

@Component({
  selector: 'sb-auth-service-test',
  imports: [CommonModule],
  templateUrl: './auth-service-test.component.html',
  styleUrl: './auth-service-test.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthServiceTestComponent {

protected _authService = inject(MyIdAuthService); // Replace with actual AuthService injection



isArray = (value:unknown) => Array.isArray(value)



}
