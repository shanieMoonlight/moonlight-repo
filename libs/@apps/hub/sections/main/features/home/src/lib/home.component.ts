import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { HubAppConstants } from '@sb-hub/core-config/constants';
import { HubAppImages } from '@sb-hub/core-config/images';
import { MainPrincipalRoutes } from '@sb-hub/sections-main/config/route-data';
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
import { SbHubSharedUiFooterComponent } from '@sb-hub/shared-ui/footer';
import { HubUiFancyNavCardComponent } from '@sb-hub/ui-cards/fancy-nav'; // Import the new card component
import { SeoService } from '@spider-baby/utils-seo';
import { ToastData, ToastService } from '@spider-baby/ui-toast';
import { HighlightModule } from 'ngx-highlightjs';
import { matToastConfig, ToastConfig, ToastSetup } from '@spider-baby/ui-toast/setup';

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
    HubHeroBanner2Component,
    SbHubSharedUiFooterComponent,
    HubUiFancyNavCardComponent // Add the new card component to imports
  ],
  providers: [
    ToastSetup.getProviders(matToastConfig)
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubMainHomeComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _toast = inject(ToastService);

  //- - - - - - - - - - - - - - -//

  // ...existing code...
  protected _title = 'Spider-Baby';
  protected _subtitle = 'A Journey Through Code, Content, and Open Source';
  protected _description = `Hi, I'm Spider-Baby. This space is dedicated to my passion for development and sharing knowledge. You'll find my blog articles, project showcases, and various open-source contributions. Feel free to look around and get inspired!`;
  // ...existing code...
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
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Signals', 'Angular library', 'Reactive State'],
    });
  }

static count = 0;


  showToast() {

    const warnToastData = ToastData.Create(
      'warn',
      'This is a WARNING toast message! ' + HubMainHomeComponent.count++,     

    )
    
    const successToastData = ToastData.Create(
      'success',
      'This is a SUCCESS toast message!'
    )

    const infoToastData = ToastData.Create(
      'info',
      'This is an INFO toast message!'
    )

    const errorToastData = ToastData.Create(
      'info',
      'This is an ERROR toast message! ' + HubMainHomeComponent.count++,
      {
        position: 'bottom',
      }
    )

    this._toast.show(warnToastData, 600000);


  }
  showErrorToast(){
    const errorToastData = ToastData.Create(
      'error',
      'This is an ERROR toast message! ' + HubMainHomeComponent.count++,
      {
        position: 'bottom',
      }
    );

    this._toast.show(errorToastData, 60000);
  }

  showSuccessToast(){
       const successToastData = ToastData.Create(
      'success',
      'This is a SUCCESS toast message! ' + HubMainHomeComponent.count++,
      {
        position: 'center',
      }
    )


    this._toast.show(successToastData, 60000);
  }

  showinfoToast(){
    const infoToastData = ToastData.Create(
      'info',
      'This is an INFO toast message!'
    )

    this._toast.show(infoToastData, 60000);
  }

    showWarnToast(){
    const warnToastData = ToastData.Create(
      'warn',
      'This is a WARNING toast message! ' + HubMainHomeComponent.count++,     

    )

    this._toast.show(warnToastData, 60000);
  }

clearAllToasts(){
   this._toast.clearAll()
}



}
