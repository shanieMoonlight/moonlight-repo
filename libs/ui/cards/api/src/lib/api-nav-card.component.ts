import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

export interface ApiRouteData {
  title: string;
  description: string;
  icon: string;
  isSvgIcon?: boolean
  route: string;
  color?: string; // Optional: Primary, secondary, tertiary, etc.
  img?: string; // Optional: image URL
}

@Component({
  selector: 'sb-ui-cards-api-nav',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink, NgClass],
  templateUrl: './api-nav-card.component.html',
  styleUrls: ['./api-nav-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SbMatApiNavCardComponent {

  _data = input.required<ApiRouteData>({ alias: 'data' });

}