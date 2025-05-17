import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HubAppConstants } from '@sb-hub/core-config/constants';
import { HubAppImages } from '@sb-hub/core-config/images';
import { HubHeroBannerComponent } from '@sb-hub/shared-ui/hero-banner';
import { HubBlogConstants } from '@sb-hub/sections-blog/config/constants';
import { HubBlogPrincipalRoutes } from '@sb-hub/sections-blog/config/route-data';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { SeoService } from '@spider-baby/utils-seo';

@Component({
  selector: 'sb-hub-blog-home',
  standalone: true,
  imports: [RouterModule, MatEverythingModule, HubHeroBannerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogHomeComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//

  protected _title = 'Spider-Baby ';
  protected _subtitle = 'Concise description of what this application does';
  protected _description = `This is a more detailed description of your application's purpose and main features. 
  You can elaborate on key functionality, target users, or any other important information
  that helps explain what makes your application valuable.`;
  protected _heroImageUrl = HubAppImages.Logo.default;
  protected _heroImageAlt = 'Spider-Baby Logo';

  protected _features = signal(HubBlogPrincipalRoutes);
  protected _gitUrl = signal(HubAppConstants.GIT_REP_URL);

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: 'Spider-Baby | Descriptions of your application',
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Signals', 'Angular library', 'Reactive State'],
    });
  }
}
