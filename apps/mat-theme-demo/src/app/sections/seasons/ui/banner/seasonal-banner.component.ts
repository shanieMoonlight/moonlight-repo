import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ml-seasonal-banner',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <div class="banner">
      <div class="banner-content">
        <h1>{{ title() }}</h1>
        <p class="subtitle">{{ subtitle() }}</p>
        
        <div class="icons">
          @for (icon of seasonalIcons(); track icon) {
            <mat-icon>{{ icon }}</mat-icon>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .banner {
      position: relative;
      height: 200px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 24px;
      background: linear-gradient(120deg, var(--primary-color) 0%, var(--tertiary-color) 100%);
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    
    .banner-content {
      padding: 32px;
      color: white;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    h1 {
      font-size: 3rem;
      margin-bottom: 8px;
    }
    
    .subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
      margin-bottom: 16px;
    }
    
    .icons {
      display: flex;
      gap: 16px;
      
      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        animation: float 3s infinite ease-in-out;
      }
      
      mat-icon:nth-child(2n) {
        animation-delay: 0.5s;
      }
      
      mat-icon:nth-child(3n) {
        animation-delay: 1s;
      }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `
})
export class SeasonalBannerComponent {
  title = input<string>('Season');
  subtitle = input<string>('Experience the beauty of this season');
  seasonalIcons = input<string[]>([]);
}