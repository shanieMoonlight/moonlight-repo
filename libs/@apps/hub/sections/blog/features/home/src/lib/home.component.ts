import { ChangeDetectionStrategy, Component, inject, OnInit, signal, } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HubAppConstants } from '@sb-hub/core-config/constants';
import { HubAppImages } from '@sb-hub/core-config/images';
import { HubBlogPrincipalRoutes } from '@sb-hub/sections-blog/config/route-data';
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
import { HubUiFancyNavCardComponent } from '@sb-hub/ui-cards/fancy-nav';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { SeoService } from '@spider-baby/utils-seo';
import { SbHubDeferredGridComponent } from './deferred-grid/deferred-grid.component';

@Component({
  selector: 'sb-hub-blog-home',
  standalone: true,
  imports: [
    RouterModule,
    MatEverythingModule,
    HubHeroBanner2Component,
    HubUiFancyNavCardComponent,
    SbHubDeferredGridComponent
  ],
  host: { ngSkipHydration: 'true' },
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogHomeComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//

  // ...existing code...
  protected _title = 'Spider-Baby Blog';
  protected _subtitle = 'Thoughts, Tutorials, and Musings on All Things Tech';
  protected _description = `Dive into my latest articles where I explore web development, share coding tips, and discuss new technologies. A place for learning, sharing, and sparking new ideas.`;
  // ...existing code...
  protected _heroImageUrl = HubAppImages.Logo.default;
  protected _heroImageAlt = 'Spider-Baby Logo';

  protected _features = signal(HubBlogPrincipalRoutes);
  protected _gitUrl = signal(HubAppConstants.GIT_REP_URL);

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Signals', 'Angular library', 'Reactive State'],
    });
  }
}
