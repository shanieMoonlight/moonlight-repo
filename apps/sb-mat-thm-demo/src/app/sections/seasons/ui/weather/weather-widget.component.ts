import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'sb-weather-widget',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatDividerModule],
  template: `
    <mat-card class="weather-card">
      <div class="weather-header">
        <div class="weather-icon">
          <mat-icon>{{ weatherIcon() }}</mat-icon>
        </div>
        <div class="weather-temp">
          {{ temperature() }}°
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="weather-details">
        <div class="detail-item">
          <mat-icon>location_on</mat-icon>
          <span>{{ location() }}</span>
        </div>
        
        <div class="detail-item">
          <mat-icon>opacity</mat-icon>
          <span>{{ humidity() }}% Humidity</span>
        </div>
        
        <div class="detail-item">
          <mat-icon>air</mat-icon>
          <span>{{ windSpeed() }} mph Wind</span>
        </div>
      </div>
    </mat-card>
  `,
  styles: `
    .weather-card {
      width: 100%;
      max-width: 320px;
      margin-bottom: 16px;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .weather-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background-color: var(--mat-sys-primary);
      color: white;
    }
    
    .weather-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
    
    .weather-temp {
      font-size: 3rem;
      font-weight: 300;
    }
    
    .weather-details {
      padding: 16px;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .detail-item mat-icon {
      margin-right: 8px;
      color: var(--mat-sys-secondary);
    }
  `
})
export class WeatherWidgetComponent {
  weatherIcon = input<string>('wb_sunny');
  temperature = input<number>(72);
  location = input<string>('Springville');
  humidity = input<number>(65);
  windSpeed = input<number>(8);
}