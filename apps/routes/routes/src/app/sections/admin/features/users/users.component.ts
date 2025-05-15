import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { AppImages1 } from '../../../../config/images';
import { AppRouteDefs } from '../../../../app-route-defs';

@Component({
  selector: 'rd-admin-users',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    HeroBannerComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersComponent {

  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//

  protected _title = 'Users';
  protected _subtitle = 'Manage application users';
  protected _description = `This section allows you to manage users, including creating, editing, and deleting accounts.`;
  protected _heroImageUrl = AppImages1.Logo.small
  protected _heroImageAlt = 'User Management';

  
  //Not calling from base admin so need to use full path
  protected _homeRoute = AppRouteDefs.fullPathsWithSlash.admin.route('home')

  protected users = [
    { id: 1, firstname: 'Alice', lastname: 'Smith', email: 'alice.smith@example.com' },
    { id: 2, firstname: 'Bob', lastname: 'Johnson', email: 'bob.johnson@example.com' },
    { id: 3, firstname: 'Carol', lastname: 'Williams', email: 'carol.williams@example.com' },
    { id: 4, firstname: 'David', lastname: 'Brown', email: 'david.brown@example.com' },
    { id: 5, firstname: 'Eve', lastname: 'Jones', email: 'eve.jones@example.com' },
    { id: 6, firstname: 'Frank', lastname: 'Garcia', email: 'frank.garcia@example.com' },
    { id: 7, firstname: 'Grace', lastname: 'Martinez', email: 'grace.martinez@example.com' },
    { id: 8, firstname: 'Henry', lastname: 'Lee', email: 'henry.lee@example.com' },
    { id: 9, firstname: 'Ivy', lastname: 'Walker', email: 'ivy.walker@example.com' },
    { id: 10, firstname: 'Jack', lastname: 'Hall', email: 'jack.hall@example.com' },
  ];

  //- - - - - - - - - - - - - - -//


  onUserClick = (id: number) =>
    this._router.navigate([AppRouteDefs.fullPaths.admin.route('users'), id]);

}
