
import { Component, computed, ElementRef, inject, input, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeOption } from '@moonlight/material/theming/config';
import { ThemeGeneratorService } from '@moonlight/material/theming/service';
import { ThemeBannerComponent } from '../../../../../shared/ui/banner/theme-banner.component';

export interface SeasonCardData {
    title: string;
    description: string;
    icon: string; // Material icon name
    theme: ThemeOption;
    routePath: string;
}

@Component({
    selector: 'ml-season-info-card',
    standalone: true,
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        ThemeBannerComponent
    ],
    template: `
    <mat-card class="season-card">
      <mat-card-header>
        <!-- Icon removed from avatar -->
        <mat-card-title>{{ _data().title }}</mat-card-title>
        <mat-card-subtitle>{{ _data().description }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="season-card-content">
        <!-- Large icon centered in content -->
        <div class="icon-container">
          <mat-icon class="large-icon">{{ _data().icon }}</mat-icon>
        </div>
        <!-- Theme banner below the icon -->
        <ml-theme-banner [theme]="_localTheme()" />
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-raised-button color="primary" (click)="navigate()">
          Go to {{ _data().title }}
        </button>
      </mat-card-actions>
    </mat-card>
  `,
    styles: [`
    .season-card {
      display: flex;
      flex-direction: column;
      height: 100%; 
    }
    .season-card-content { /* Renamed class for clarity */
      flex-grow: 1; 
      display: flex; /* Use flexbox for content layout */
      flex-direction: column; /* Stack icon and banner vertically */
      justify-content: center; /* Center items vertically */
      align-items: center; /* Center items horizontally */
      padding: 24px 16px; /* Adjust padding */
      min-height: 150px; /* Ensure minimum height for content */
    }
    .icon-container {
        flex-grow: 1; /* Allow icon container to take up space */
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    .large-icon {
      font-size: 64px; /* Make icon larger */
      width: 64px;
      height: 64px;
      color: var(--mat-sys-primary); /* Use primary theme color for icon */
      margin-bottom: 24px; /* Space between icon and banner */
    }
    ml-theme-banner {
        width: 100%; /* Make banner take full width */
        margin-top: auto; /* Push banner towards the bottom if space allows */
    }
    mat-card-actions {
        margin-top: auto; /* Push actions to the bottom */
    }
  `]
})
export class SeasonInfoCardComponent implements OnInit {

    private themeGenerator = inject(ThemeGeneratorService);
    private elementRef = inject(ElementRef);
    private router = inject(Router);

    //- - - - - - - - - - - - - - -//

    _data = input.required<SeasonCardData>({ alias: 'data' });

    //- - - - - - - - - - - - - - -//

    protected _localTheme = computed(() => this._data().theme);
    // Internal signal/property to hold the theme for the banner

    //-----------------------------//

    ngOnInit(): void {
        // Apply the theme locally to this card component instance
        this.themeGenerator.applyTheme(
            this._data().theme,
            `season-card-${this._data().theme.value}`, // Optional unique class
            this.elementRef.nativeElement
        )
    }

    //-----------------------------//

    navigate = () =>
        this.router.navigate([this._data().routePath])

    //-----------------------------//

}//Cls