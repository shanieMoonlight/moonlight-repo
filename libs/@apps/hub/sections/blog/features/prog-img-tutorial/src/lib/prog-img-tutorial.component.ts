import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from '@spider-baby/utils-seo';
// import { IconsService } from '@sb-hub-blog-features-prog-img-tutorial/shared-utils/icons';

@Component({
  standalone: true,
  imports: [
  ],
  providers: [],
  selector: 'sb-hub-blog-features-prog-img-tutorial',
  templateUrl: './prog-img-tutorial.component.html',
  styleUrl: './prog-img-tutorial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogProgImgTutorialComponent {
 
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
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Angular library'],
    });
  }


} //Cls
