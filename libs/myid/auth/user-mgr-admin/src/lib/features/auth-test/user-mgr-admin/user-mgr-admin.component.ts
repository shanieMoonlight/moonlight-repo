import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserMgrAdminAuthService } from '../../../services/user-admin-auth.browser.service';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'sb-auth-service-user-mgr-admin',
  imports: [JsonPipe],
  templateUrl: './user-mgr-admin.component.html',
  styleUrl: './user-mgr-admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthServiceUserMgrAdminComponent {

  protected _authService = inject(UserMgrAdminAuthService); 



  isArray = (value: unknown) => Array.isArray(value)



}

