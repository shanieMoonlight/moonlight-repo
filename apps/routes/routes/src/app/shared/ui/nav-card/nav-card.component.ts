import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';

export interface NavCardData {
  title: string;
  description: string;
  icon: string;
  isSvgIcon?: boolean
  route: string;
  color?: string; // Optional: Primary, secondary, tertiary, etc.
  tooltip?:string
}

@Component({
  selector: 'rd-ui-cards-admin-nav',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './nav-card.component.html',
  styleUrls: ['./nav-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavCardComponent {

  _data = input.required<NavCardData>({ alias: 'data' });

}