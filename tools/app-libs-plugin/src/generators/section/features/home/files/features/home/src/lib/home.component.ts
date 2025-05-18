import { ChangeDetectionStrategy, Component, inject, OnInit, signal, } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { <%= classNamePrefix %>AppConstants } from '@sb-hub/core-config/constants';
import { <%= classNamePrefix %>AppImages } from '@sb-hub/core-config/images';
import { <%= classNamePrefix %>HeroBannerComponent } from '@sb-hub/shared-ui/hero-banner';
import { <%= sectionClassNamePrefix %>Constants } from '<%= importPrefix %>/config/constants';
import { <%= sectionClassNamePrefix %>PrincipalRoutes } from '<%= importPrefix %>/config/route-data';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { SeoService } from '@spider-baby/utils-seo';


@Component({
  selector: '<%= prefix %>-<%= name %>-home',
  standalone: true,
  imports: [
    RouterModule,
    MatEverythingModule,
    <%= classNamePrefix %>HeroBannerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= sectionClassNamePrefix %>HomeComponent implements OnInit {

  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//

  protected _title = 'Spider-Baby ';
  protected _subtitle = 'Concise description of what this application does';
  protected _description = `This is a more detailed description of your application's purpose and main features. 
  You can elaborate on key functionality, target users, or any other important information
  that helps explain what makes your application valuable.`;
  protected _heroImageUrl = <%= classNamePrefix %>AppImages.Logo.default;
  protected _heroImageAlt = 'Spider-Baby Logo';

  protected _features = signal(<%= sectionClassNamePrefix %>PrincipalRoutes);
  protected _gitUrl = signal(<%= classNamePrefix %>AppConstants.GIT_REP_URL);

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
