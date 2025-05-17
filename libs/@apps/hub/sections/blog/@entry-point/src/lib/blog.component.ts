import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HubNavbarComponent } from '@sb-hub/sections-blog/ui/nav';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent, } from '@spider-baby/material-theming/components';

@Component({
  standalone: true,
  imports: [
    HubNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule
  ],
  providers: [],
  selector: 'sb-hub-blog-root',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class HubBlogComponent {


  //----------------------------//

  constructor() {
    console.log('constructor');
  }

  //----------------------------//


} //Cls
