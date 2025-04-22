import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '@moonlight/material/theming/service';
import { SeasonalBannerComponent } from '../../ui/banner/seasonal-banner.component';
import { SeasonalCardComponent } from '../../ui/card/seasonal-card.component';
import { WeatherWidgetComponent } from '../../ui/weather/weather-widget.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'ml-summer',
  standalone: true,
  imports: [
    SeasonalBannerComponent,
    SeasonalCardComponent,
    WeatherWidgetComponent,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="season-page">
      <ml-seasonal-banner 
        title="Summer" 
        subtitle="Long days, warm nights, endless possibilities"
        [seasonalIcons]="['wb_sunny', 'beach_access', 'waves']"/>
      
      <div class="content-area">
        <section class="weather-section">
          <h2>Summer Weather</h2>
          <ml-weather-widget
            weatherIcon="wb_sunny"
            [temperature]="88"
            location="Sunset Beach"
            [humidity]="65"
            [windSpeed]="8"/>
        </section>
        
        <mat-divider></mat-divider>
        
        <section class="activities-section">
          <h2>Summer Activities</h2>
          <div class="card-grid">
            <ml-seasonal-card
              title="Beach Day"
              subtitle="Sand & surf"
              content="Dive into crystal clear waters, build sandcastles, or simply relax under an umbrella. The beach offers a perfect escape from summer heat."
              icon="beach_access"/>
            
            <ml-seasonal-card
              title="Outdoor Festivals"
              subtitle="Music & art"
              content="Summer is festival season! From music to food, art to cultural celebrations, there's always something happening under the summer sky."
              icon="festival"/>
            
            <ml-seasonal-card
              title="Water Sports"
              subtitle="Cool adventures"
              content="Try kayaking, paddleboarding, or jet skiing to beat the heat while enjoying the thrill of water adventures. Perfect for adrenaline seekers!"
              icon="surfing"/>
          </div>
        </section>
        
        <mat-divider></mat-divider>
        
        <section class="seasonal-progress">
          <h2>Season Progress</h2>
          <div class="progress-container">
            <div class="progress-label">
              <span>June</span>
              <span>July</span>
              <span>August</span>
            </div>
            <mat-progress-bar mode="determinate" [value]="50" color="primary"></mat-progress-bar>
          </div>
          <p class="progress-text">Summer is at its peak! The days are long and the sun is bright.</p>
        </section>
        
        <section class="seasonal-highlights">
          <h2>Summer Highlights</h2>
          <div class="highlights-wrapper">
            <div class="highlight-item primary-bg">
              <mat-icon>wb_sunny</mat-icon>
              <span>15 Hours of Daylight</span>
            </div>
            <div class="highlight-item secondary-bg">
              <mat-icon>pool</mat-icon>
              <span>Perfect Pool Weather</span>
            </div>
            <div class="highlight-item tertiary-bg">
              <mat-icon>outdoor_grill</mat-icon>
              <span>BBQ Season</span>
            </div>
          </div>
        </section>
        
        <section class="navigation-section">
          <h2>Explore Other Seasons</h2>
          <div class="nav-buttons">
            <button mat-raised-button color="primary" (click)="goToSeason('spring')">
              <mat-icon>eco</mat-icon> Spring
            </button>
            <button mat-raised-button color="primary" (click)="goToSeason('autumn')">
              <mat-icon>park</mat-icon> Autumn
            </button>
            <button mat-raised-button color="primary" (click)="goToSeason('winter')">
              <mat-icon>ac_unit</mat-icon> Winter
            </button>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: `
    .season-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }
    
    h2 {
      margin-top: 32px;
      margin-bottom: 16px;
      color: var(--mat-sys-primary);
    }
    
    mat-divider {
      margin: 32px 0;
    }
    
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin: 24px 0;
    }
    
    .progress-container {
      margin: 24px 0;
    }
    
    .progress-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .progress-text {
      margin-top: 8px;
      font-style: italic;
    }
    
    .nav-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin: 24px 0;
    }
    
    .weather-section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .weather-section h2 {
      align-self: flex-start;
    }
    
    .highlights-wrapper {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin: 24px 0;
    }
    
    .highlight-item {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      border-radius: 12px;
      color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    
    .highlight-item mat-icon {
      margin-right: 8px;
    }
    
    .primary-bg {
      background-color: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
    }
    
    .secondary-bg {
      background-color: var(--mat-sys-secondary);
      color: var(--mat-sys-on-secondary);
    }
    
    .tertiary-bg {
      background-color: var(--mat-sys-tertiary);
      color: var(--mat-sys-on-tertiary);
    }
  `
})
export class SummerComponent implements OnInit {
  private themeService = inject(ThemeService);
  private router = inject(Router);
  
  ngOnInit() {
    // Apply the Summer theme when this component initializes
    this.themeService.setThemeByValue('summer');
  }
  
  goToSeason(season: string) {
    this.router.navigate(['/features/seasons', season]);
  }
}