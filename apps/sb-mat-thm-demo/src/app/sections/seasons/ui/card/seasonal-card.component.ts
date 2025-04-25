import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ml-seasonal-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <mat-card class="seasonal-card">
      <div class="card-icon">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <mat-card-header>
        <mat-card-title>{{ title() }}</mat-card-title>
        <mat-card-subtitle>{{ subtitle() }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p>{{ content() }}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button color="primary">Learn More</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    .seasonal-card {
      max-width: 350px;
      margin-bottom: 16px;
      transition: transform 0.3s ease;
    }
    
    .seasonal-card:hover {
      transform: translateY(-5px);
    }
    
    .card-icon {
      display: flex;
      justify-content: center;
      margin: 16px 0;
    }
    
    .card-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(---mat-sys-primary);
    }

  `
})
export class SeasonalCardComponent {
  title = input<string>('Card Title');
  subtitle = input<string>('Card Subtitle');
  content = input<string>('Card content goes here...');
  icon = input<string>('eco');
}