import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';
import { AppConstants } from '../../../../config/constants';
import { AppImages } from '../../../../config/images';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { MAIN_ROUTES } from '../../config/route-data';

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
    description: 'Brief description of the first key feature and its primary benefit',
    icon: 'code'
  },
  {
    title: 'Feature Two',
    description: 'Brief description of the second key feature and its primary benefit',
    icon: 'bolt'
  },
  {
    title: 'Feature Three',
    description: 'Brief description of the third key feature and its primary benefit',
    icon: 'compress'
  },
  {
    title: 'Feature Four',
    description: 'Brief description of the fourth key feature and its primary benefit',
    icon: 'extension'
  },
  {
    title: 'Feature Five',
    description: 'Brief description of the fifth key feature and its primary benefit',
    icon: 'terminal'
  },
  {
    title: 'Feature Six',
    description: 'Brief description of the sixth key feature and its primary benefit',
    icon: 'layers'
  }
];

//##############################################//

@Component({
  selector: '<%= prefix %>-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    HeroBannerComponent,
    HighlightModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHomeComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//

  protected _title = '<%= displayName %> ';
  protected _subtitle = 'Concise description of what this application does';
  protected _description = `This is a more detailed description of your application's purpose and main features. 
  You can elaborate on key functionality, target users, or any other important information
  that helps explain what makes your application valuable.`;
  protected _heroImageUrl = AppImages.Logo.default
  protected _heroImageAlt = '<%= displayName %> Logo';

  protected _features = signal(MAIN_ROUTES);
  protected _gitUrl = signal(AppConstants.GIT_REP_URL);
  protected _benefits = signal(BENEFITS);

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Signals', 'Angular library', 'Reactive State']
    });
  }
}

