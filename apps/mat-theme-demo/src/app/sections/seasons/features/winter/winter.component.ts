import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '@moonlight/material-theming/service';
import { SeasonalBannerComponent } from '../../ui/banner/seasonal-banner.component';
import { SeasonalCardComponent } from '../../ui/card/seasonal-card.component';
import { WeatherWidgetComponent } from '../../ui/weather/weather-widget.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'ml-winter',
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
        title="Winter" 
        subtitle="A peaceful landscape of snow and ice"
        [seasonalIcons]="['ac_unit', 'nights_stay', 'snowing']"
      ></ml-seasonal-banner>
      
      <div class="content-area">
        <section class="weather-section">
          <h2>Winter Weather</h2>
          <ml-weather-widget
            weatherIcon="snowing"
            [temperature]="28"
            location="Frost Valley"
            [humidity]="85"
            [windSpeed]="15"/>
        </section>
        
        <mat-divider/>
        
        <section class="activities-section">
          <h2>Winter Activities</h2>
          <div class="card-grid">
            <ml-seasonal-card
              title="Skiing & Snowboarding"
              subtitle="Mountain adventures"
              content="Carve through fresh powder on mountain slopes. Whether you're a novice or expert, winter sports offer exhilarating ways to embrace the cold season."
              icon="downhill_skiing"/>
            
            <ml-seasonal-card
              title="Cozy Retreats"
              subtitle="Warm indulgence"
              content="Embrace hygge with plush blankets, crackling fireplaces, and steaming mugs of hot chocolate. Winter is the perfect time for indoor comfort."
              icon="fireplace"/>
            
            <ml-seasonal-card
              title="Holiday Magic"
              subtitle="Festive celebrations"
              content="Experience the wonder of winter holidays with twinkling lights, festive decorations, and seasonal traditions that bring warmth to the coldest months."
              icon="celebration"/>
          </div>
        </section>
        
        <mat-divider/>
        
        <section class="ice-crystals">
          <h2>Winter's Crystal Gallery</h2>
          <div class="crystal-container">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="snowflake-card">
                <mat-icon class="large-icon">ac_unit</mat-icon>
                <div class="snowflake-label">Frost Pattern {{ i }}</div>
              </div>
            }
          </div>
        </section>
        
        <section class="seasonal-progress">
          <h2>Season Progress</h2>
          <div class="progress-container">
            <div class="progress-label">
              <span>December</span>
              <span>January</span>
              <span>February</span>
            </div>
            <mat-progress-bar mode="determinate" [value]="40" color="primary"></mat-progress-bar>
          </div>
          <p class="progress-text">Deep winter has arrived. Snow blankets the landscape in pristine white.</p>
        </section>
        
        <section class="winter-meditation">
          <h2>Winter Soundscape</h2>
          <div class="sound-card">
            <mat-icon>volume_up</mat-icon>
            <div class="sound-details">
              <div class="sound-title">Quiet Snowfall</div>
              <div class="sound-controls">
                <button mat-icon-button color="primary">
                  <mat-icon>play_arrow</mat-icon>
                </button>
                <mat-progress-bar mode="determinate" [value]="0" color="primary" class="sound-progress"></mat-progress-bar>
              </div>
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
    
    .crystal-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin: 24px 0;
    }
    
    .snowflake-card {
      width: 150px;
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-primary-95) 0%, var(--color-primary-99) 100%);
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .snowflake-card:hover {
      transform: translateY(-8px);
    }
    
    .large-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      color: var(--mat-sys-primary);
    }
    
    .snowflake-label {
      text-align: center;
      color: var(--mat-sys-primary);
    }
    
    .sound-card {
      background-color: var(--color-primary-95);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      max-width: 400px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .sound-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--mat-sys-primary);
    }
    
    .sound-details {
      flex: 1;
    }
    
    .sound-title {
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .sound-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .sound-progress {
      flex: 1;
    }
  `
})
export class WinterComponent implements OnInit {
  private themeService = inject(ThemeService);
  private router = inject(Router);
  
  ngOnInit() {
    // Apply the Winter theme when this component initializes
    this.themeService.setThemeByValue('winter');
  }
  
  goToSeason(season: string) {
    this.router.navigate(['/seasons', season]);
  }
}