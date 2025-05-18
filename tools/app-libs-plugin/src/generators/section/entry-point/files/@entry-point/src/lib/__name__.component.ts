import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { <%= sectionClassNamePrefix %>NavbarComponent } from '<%= importPrefix %>/ui-nav';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent, } from '@spider-baby/material-theming/components';
import { SeoService } from '@spider-baby/utils-seo';
// import { IconsService } from '@<%= prefix %>/shared-utils/icons';

@Component({
  standalone: true,
  imports: [
    <%= sectionClassNamePrefix %>NavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule
  ],
  providers: [],
  selector: '<%= prefix %>-<%= name %>-root',
  templateUrl: './<%= name %>.component.html',
  styleUrl: './<%= name %>.component.scss',
})
export class <%= sectionClassNamePrefix %>Component {
 
  //  protected _iconsService = inject(IconsService); 
  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//
  
  protected _title = 'Spider-Baby ';
  protected _subtitle = 'Concise description of what this application does';
  protected _description = `This is a more detailed description of your application's purpose and main features. 
  You can elaborate on key functionality, target users, or any other important information
  that helps explain what makes your application valuable.`;



  //----------------------------//

  constructor() {
    console.log('constructor');
    // this._iconsService.registerIcons();
    this._seoService.updateMetadata({
      title: 'Spider-Baby | Descriptions of your application',
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Angular library'],
    });
  }

  //----------------------------//


} //Cls
