import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { DarkModeToggle_Mat_Component, ThemePicker_Mat_Component } from '@moonlight/ng/theming/mat';
import { ThemeAndModeSetup } from '@moonlight/ng/theming/config';
import { THEME_CONFIG } from './config/app-theme.config';


@Component({
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    NavbarComponent,
    DarkModeToggle_Mat_Component,
    ThemePicker_Mat_Component,
    RouterModule
  ],
  providers: [
    
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mat-theme-demo';
}
