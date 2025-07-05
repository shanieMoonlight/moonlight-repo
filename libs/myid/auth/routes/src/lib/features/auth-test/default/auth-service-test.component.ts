import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MyIdAuthService} from '@spider-baby/myid-auth/services';

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
