import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '@moonlight/material/theming/service';
import { SeasonalBannerComponent } from '../widgets/seasonal-banner.component';
import { SeasonalCardComponent } from '../widgets/seasonal-card.component';
import { WeatherWidgetComponent } from '../widgets/weather-widget.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spring',
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
      <app-seasonal-banner 
        title="Spring" 
        subtitle="A time of renewal and growth"
        [seasonalIcons]="['eco', 'local_florist', 'water_drop']"
      ></app-seasonal-banner>
      
      <div class="content-area">
        <section class="weather-section">
          <h2>Spring Weather</h2>
          <app-weather-widget
            weatherIcon="wb_sunny"
            [temperature]="68"
            location="Bloom Gardens"
            [humidity]="72"
            [windSpeed]="12"
          ></app-weather-widget>
        </section>
        
        <mat-divider></mat-divider>
        
        <section class="activities-section">
          <h2>Spring Activities</h2>
          <div class="card-grid">
            <app-seasonal-card
              title="Garden Planting"
              subtitle="Start your garden"
              content="Spring is the perfect time to begin planting flowers, vegetables, and herbs. The warming soil and increased daylight hours create ideal conditions for new growth."
              icon="yard"
            ></app-seasonal-card>
            
            <app-seasonal-card
              title="Bird Watching"
              subtitle="Migratory returns"
              content="Many bird species return from their winter migrations during spring. Take advantage of this season to observe various birds in their natural habitats."
              icon="flight"
            ></app-seasonal-card>
            
            <app-seasonal-card
              title="Spring Cleaning"
              subtitle="Refresh your space"
              content="Spring is traditionally associated with cleaning and organizing. Clear out the winter clutter and prepare your home for the warmer months ahead."
              icon="cleaning_services"
            ></app-seasonal-card>
          </div>
        </section>
        
        <mat-divider></mat-divider>
        
        <section class="seasonal-progress">
          <h2>Season Progress</h2>
          <div class="progress-container">
            <div class="progress-label">
              <span>March</span>
              <span>April</span>
              <span>May</span>
            </div>
            <mat-progress-bar mode="determinate" [value]="50" color="primary"></mat-progress-bar>
          </div>
          <p class="progress-text">Spring is in full bloom! Flowers are opening and trees are leafing out.</p>
        </section>
        
        <section class="navigation-section">
          <h2>Explore Other Seasons</h2>
          <div class="nav-buttons">
            <button mat-raised-button color="primary" (click)="goToSeason('winter')">
              <mat-icon>ac_unit</mat-icon> Winter
            </button>
            <button mat-raised-button color="primary" (click)="goToSeason('summer')">
              <mat-icon>wb_sunny</mat-icon> Summer
            </button>
            <button mat-raised-button color="primary" (click)="goToSeason('autumn')">
              <mat-icon>eco</mat-icon> Autumn
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
      color: var(--primary-color);
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
  `
})
export class SpringComponent implements OnInit {
  private themeService = inject(ThemeService);
  private router = inject(Router);
  
  ngOnInit() {
    // Apply the Spring theme when this component initializes
    this.themeService.setThemeByValue('spring');
  }
  
  goToSeason(season: string) {
    this.router.navigate(['/features/seasons', season]);
  }
}