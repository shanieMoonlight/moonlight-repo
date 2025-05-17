import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { <%= classNamePrefix %>NavbarComponent } from '<%= baseImportPath %>/sections-<%= name %>/ui/nav';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent, } from '@spider-baby/material-theming/components';

@Component({
  standalone: true,
  imports: [
    <%= classNamePrefix %>NavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule
  ],
  providers: [],
  selector: '<%= prefix %>-<%= name %>-root',
  templateUrl: './<%= name %>.component.html',
  styleUrl: './<%= name %>.component.scss',
})
export class <%= classNamePrefix %><%= className %>Component {


  //----------------------------//

  constructor() {
    console.log('constructor');
  }

  //----------------------------//


} //Cls
