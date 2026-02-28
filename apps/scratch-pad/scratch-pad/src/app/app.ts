import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScratchPadNavbar } from "./ui/nav/nav";
import { SbDarkModeToggleMatComponent, SbThemePickerMatComponent } from '@spider-baby/material-theming/components';

@Component({
  imports: [RouterModule, ScratchPadNavbar,
    SbDarkModeToggleMatComponent,
    SbThemePickerMatComponent,],
  selector: 'scratch-pad-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'scratch-pad';
}
