import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';
// import { IconsService } from '@sb-hub-blog-features-auth-service/shared-utils/icons';

// Code samples
import { JwtPayloadCode, JwtHelperCode, CustomJwtPayloadCode } from './code/jwt-examples';
import { BaseAuthSignalServiceCode } from './code/base-auth-service';
import { AuthSignalServiceCode, UsageExampleCode, GuardExampleCode } from './code/auth-service-examples';
import { HowToImplementCode, InstallationCode, SetupCode } from './code/how-to-implement';
import { BlogConstants } from './config/constants';

@Component({
  standalone: true,
  imports: [
    HighlightModule,
    // MatCardModule,
    // MatDividerModule,
    // SbHubPkgLinksComponent,
    // HubHeroBanner2Component
  ],
  providers: [],
  selector: 'sb-hub-blog-features-auth-service',
  templateUrl: './auth-service.component.html',
  styleUrl: './auth-service.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogAuthServiceComponent {
  //  protected _iconsService = inject(IconsService); 
  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //----------------------------//

  // SEO and tutorial metadata
  protected _title = BlogConstants.AuthServiceTutorial.Title;
  protected _subtitle = BlogConstants.AuthServiceTutorial.Subtitle;
  protected _description = BlogConstants.AuthServiceTutorial.Description;
  protected _gitHubRepoUrl = BlogConstants.AuthServiceTutorial.GitHubRepo;
  protected _npmPackageUrl = BlogConstants.AuthServiceTutorial.NpmPackage;

  // Code samples for tutorial
  protected _jwtPayloadCode = JwtPayloadCode;
  protected _jwtHelperCode = JwtHelperCode;
  protected _baseAuthSignalServiceCode = BaseAuthSignalServiceCode;
  protected _authSignalServiceCode = AuthSignalServiceCode;
  protected _usageExampleCode = UsageExampleCode;
  protected _guardExampleCode = GuardExampleCode;
  protected _customJwtPayloadCode = CustomJwtPayloadCode;
  protected _howToImplementCode = HowToImplementCode;
  protected _installationCode = InstallationCode;
  protected _setupCode = SetupCode;

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
