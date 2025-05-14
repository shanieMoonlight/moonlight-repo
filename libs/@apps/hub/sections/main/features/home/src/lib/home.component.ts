import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { HubAppConstants } from '@sb-hub/core-config/constants';
import { HubAppImages } from '@sb-hub/core-config/images';
import { HubHeroBannerComponent } from '@sb-hub/shared-ui/hero-banner';
import { MAIN_PRINCIPAL_ROUTES } from '@sb-hub/sections-main/config/route-data';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';

//##############################################//

interface Feature {
  title: string;
  description: string;
  route: string;
  icon: string;
}

//##############################################//

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

//##############################################//

const BENEFITS: Benefit[] = [
  {
    title: 'Feature One',
    description:
      'Brief description of the first key feature and its primary benefit',
    icon: 'code',
  },
  {
    title: 'Feature Two',
    description:
      'Brief description of the second key feature and its primary benefit',
    icon: 'bolt',
  },
  {
    title: 'Feature Three',
    description:
      'Brief description of the third key feature and its primary benefit',
    icon: 'compress',
  },
  {
    title: 'Feature Four',
    description:
      'Brief description of the fourth key feature and its primary benefit',
    icon: 'extension',
  },
  {
    title: 'Feature Five',
    description:
      'Brief description of the fifth key feature and its primary benefit',
    icon: 'terminal',
  },
  {
    title: 'Feature Six',
    description:
      'Brief description of the sixth key feature and its primary benefit',
    icon: 'layers',
  },
];

//##############################################//

@Component({
  selector: 'hub-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    HubHeroBannerComponent,
    HighlightModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubMainHomeComponent implements OnInit {
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

  protected _features = signal(MAIN_PRINCIPAL_ROUTES);
  protected _gitUrl = signal(HubAppConstants.GIT_REP_URL);
  protected _benefits = signal(BENEFITS);

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
