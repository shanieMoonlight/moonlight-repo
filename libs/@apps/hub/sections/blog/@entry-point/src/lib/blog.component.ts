
import { Component, inject, OnDestroy, OnInit, DOCUMENT } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HubBlogNavbarComponent } from '@sb-hub/sections-blog/ui-nav';
import { IconsService } from '@sb-hub/shared-utils/icons';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent, } from '@spider-baby/material-theming/components';
import { SeoService } from '@spider-baby/utils-seo';

@Component({
  standalone: true,
  imports: [
    HubBlogNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule
  ],
  providers: [],
  selector: 'sb-hub-blog-root',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class HubBlogComponent implements OnInit, OnDestroy {

  protected _iconsService = inject(IconsService);
  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _document = inject(DOCUMENT);

  //- - - - - - - - - - - - - - -//

  protected _title = 'Spider-Baby | Blog';
  protected _subtitle = 'Thoughts, Tutorials, and Musings on All Things Tech';
  protected _description = `Dive into my latest articles where I explore web development, share coding tips, and discuss new technologies. A place for learning, sharing, and sparking new ideas.`;



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

  //----------------------------//


  ngOnInit(): void {
    this._document.body.classList.add('use-slide-transition');
  }

  ngOnDestroy(): void {
    this._document.body.classList.remove('use-slide-transition');
  }



} //Cls
