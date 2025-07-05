import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMgrAdminAuthService } from '../../../services/user-admin-auth.browser.service';
@Component({
  selector: 'sb-auth-service-user-mgr-admin',
  imports: [CommonModule],
  templateUrl: './user-mgr-admin.component.html',
  styleUrl: './user-mgr-admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthServiceUserMgrAdminComponent {

  protected _authService = inject(UserMgrAdminAuthService); 



  isArray = (value: unknown) => Array.isArray(value)



}

