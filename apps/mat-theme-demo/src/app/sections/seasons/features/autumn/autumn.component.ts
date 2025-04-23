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
import { AUTUMN_THEME } from '../../config/seasonal-theme.config';

@Component({
  selector: 'ml-autumn',
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
        title="Autumn" 
        subtitle="The season of change and harvest"
        [seasonalIcons]="['eco', 'park', 'forest']"/>
      
      <div class="content-area">
        <section class="weather-section">
          <h2>Autumn Weather</h2>
          <ml-weather-widget
            weatherIcon="filter_drama"
            [temperature]="58"
            location="Maple Ridge"
            [humidity]="73"
            [windSpeed]="12"/>
        </section>
        
        <mat-divider/>
        
        <section class="activities-section">
          <h2>Autumn Activities</h2>
          <div class="card-grid">
            <ml-seasonal-card
              title="Leaf Peeping"
              subtitle="Vibrant landscapes"
              content="Take in the breathtaking views as leaves transform into brilliant shades of red, orange, and gold. Scenic drives and hiking trails offer perfect vantage points."
              icon="park"/>
            
            <ml-seasonal-card
              title="Harvest Festivals"
              subtitle="Seasonal celebrations"
              content="Celebrate the bounty of the season at local harvest festivals featuring apple picking, pumpkin patches, hayrides, corn mazes, and artisanal foods."
              icon="agriculture"/>
            
            <ml-seasonal-card
              title="Cozy Evenings"
              subtitle="Autumn comfort"
              content="As evenings grow cooler, enjoy the comforts of warm drinks, hearty soups, and gathering around fire pits with friends and family."
              icon="local_fire_department"/>
          </div>
        </section>
        
        <mat-divider/>
        
        <section class="seasonal-progress">
          <h2>Season Progress</h2>
          <div class="progress-container">
            <div class="progress-label">
              <span>September</span>
              <span>October</span>
              <span>November</span>
            </div>
            <mat-progress-bar mode="determinate" [value]="60" color="primary"></mat-progress-bar>
          </div>
          <p class="progress-text">The foliage is at peak color! Crisp air and golden landscapes dominate.</p>
        </section>
        
        <section class="seasonal-gallery">
          <h2>Autumn Palette</h2>
          <div class="color-palette">
            <div class="color-swatch" style="background-color: var(--color-primary-60)">
              <span>Pumpkin</span>
            </div>
            <div class="color-swatch" style="background-color: var(--color-secondary-70)">
              <span>Gold</span>
            </div>
            <div class="color-swatch" style="background-color: var(--color-primary-40)">
              <span>Russet</span>
            </div>
            <div class="color-swatch" style="background-color: var(--color-primary-30)">
              <span>Auburn</span>
            </div>
          </div>
        </section>
        
        <section class="navigation-section">
          <h2>Explore Other Seasons</h2>
          <div class="nav-buttons">
            <button mat-raised-button color="primary" (click)="goToSeason('spring')">
              <mat-icon>spa</mat-icon> Spring
            </button>
            <button mat-raised-button color="primary" (click)="goToSeason('summer')">
              <mat-icon>sunny</mat-icon> Summer
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
    
    .color-palette {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin: 24px 0;
    }
    
    .color-swatch {
      width: 100px;
      height: 100px;
      border-radius: 12px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      transition: transform 0.3s ease;
    }
    
    .color-swatch:hover {
      transform: scale(1.05);
    }
    
    .color-swatch span {
      padding: 8px;
      background-color: rgba(0,0,0,0.3);
      width: 100%;
      text-align: center;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  `
})
export class AutumnComponent implements OnInit {
  private themeService = inject(ThemeService);
  private router = inject(Router);
  
  ngOnInit() {
    // Apply the Autumn theme when this component initializes
    this.themeService.setTheme(AUTUMN_THEME);
  }
  
  goToSeason(season: string) {
    this.router.navigate(['/features/seasons', season]);
  }
}