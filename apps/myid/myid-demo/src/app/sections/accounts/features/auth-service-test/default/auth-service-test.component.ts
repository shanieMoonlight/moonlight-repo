import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MyIdAuthService } from '../../../../../shared/id/auth/services/auth/myid-auth.browser.service';

@Component({
  selector: 'sb-auth-service-test',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './auth-service-test.component.html',
  styleUrl: './auth-service-test.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthServiceTestComponent {

  protected _authService = inject(MyIdAuthService); 



  isArray = (value: unknown) => Array.isArray(value)



}
