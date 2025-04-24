import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { THEME_CONFIG } from './config/app-theme.config';
import { ThemeAndModeSetup } from '@moonlight/material-theming/config';
// import { NavbarComponent } from './shared/ui/navbar/navbar.component';


@Component({
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    // NavbarComponent,
    RouterModule
  ],
  providers: [    
    ThemeAndModeSetup.provideThemingModule(THEME_CONFIG)
  ],
  selector: 'ml-app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'material-theming-demo';

}
