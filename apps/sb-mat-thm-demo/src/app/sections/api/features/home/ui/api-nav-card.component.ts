import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

export interface ApiRouteData {
  title: string;
  description: string;
  icon: string;
  route: string;
  color?: string; // Optional: Primary, secondary, tertiary, etc.
}

@Component({
  selector: 'sb-api-nav-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink, NgClass],
  templateUrl: './api-nav-card.component.html',
  styleUrls: ['./api-nav-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiNavCardComponent {
  @Input({ required: true }) data!: ApiRouteData;
}