import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { HubAppConstants } from '@sb-hub/core-config/constants';
import { HubAppImages } from '@sb-hub/core-config/images';
import { MainPrincipalRoutes } from '@sb-hub/sections-main/config/route-data';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';
import { SbHubUiFancyNavCardComponent } from '@spider-baby/ui-cards/fancy-nav'; // Import the new card component

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
    HighlightModule,
    NgClass,
    SbHubUiFancyNavCardComponent // Add the new card component to imports
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

  protected _features = signal(MainPrincipalRoutes);
  protected _gitUrl = signal(HubAppConstants.GIT_REP_URL);
  protected _npmUrl = signal(HubAppConstants.NPM_PKG_URL);

  protected _currentYear = new Date().getFullYear()

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
