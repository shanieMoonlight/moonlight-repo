import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { DarkModeToggle_Mat_Component, ThemePicker_Mat_Component } from '@moonlight/ng/theming/mat';
import { NavbarComponent } from './ui/navbar/navbar.component';


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
