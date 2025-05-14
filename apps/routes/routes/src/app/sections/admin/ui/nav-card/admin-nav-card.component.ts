import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';

export interface AdminRouteData {
  title: string;
  description: string;
  icon: string;
  isSvgIcon?: boolean
  route: string;
  color?: string; // Optional: Primary, secondary, tertiary, etc.
}

@Component({
  selector: 'rd-ui-cards-admin-nav',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './admin-nav-card.component.html',
  styleUrls: ['./admin-nav-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNavCardComponent {

  _data = input.required<AdminRouteData>({ alias: 'data' });

}