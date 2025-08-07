import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { SbThemeService } from '@spider-baby/material-theming/service';
import { SeasonalBannerComponent } from '../../ui/banner/seasonal-banner.component';
import { SeasonalCardComponent } from '../../ui/card/seasonal-card.component';
import { WeatherWidgetComponent } from '../../ui/weather/weather-widget.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'sb-spring',
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
  templateUrl: './spring.component.html',
  styleUrl: './spring.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpringComponent implements OnInit {
  private themeService = inject(SbThemeService);
  private router = inject(Router);

  //-----------------------------------//

  constructor() {
    console.log('SpringComponent initialized');

  }

  ngOnInit() {
    // Apply the Spring theme when this component initializes
    this.themeService.setThemeByValue('spring');
  }

  goToSeason(season: string) {
    this.router.navigate(['/seasons', season]);
  }
}