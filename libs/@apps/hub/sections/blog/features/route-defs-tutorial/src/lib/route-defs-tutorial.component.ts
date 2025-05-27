import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from '@spider-baby/utils-seo';
import { PostRouteDefsTutorialComponent } from '@spider-baby/posts-route-defs-tutorial';
import { SbHubSharedUiFooterComponent } from '@sb-hub/shared-ui/footer';
import { SbPortalInputComponent } from '@spider-baby/utils-portal';
import { SbHubPkgLinksComponent } from '@sb-hub/shared-ui/pkg-links';
import { BlogPostConstants } from './config/constants';
// import { IconsService } from '@sb-hub-blog-features-route-defs-tutorial/shared-utils/icons';


@Component({
  standalone: true,
  imports: [
    PostRouteDefsTutorialComponent,
    SbHubSharedUiFooterComponent,
    SbPortalInputComponent,
    SbHubPkgLinksComponent,
  ],
  providers: [],
  selector: 'sb-hub-blog-features-route-defs-tutorial',
  templateUrl: './route-defs-tutorial.component.html',
  styleUrl: './route-defs-tutorial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogRouteDefsTutorialComponent {
 
  //  protected _iconsService = inject(IconsService); 
  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//
  
  protected readonly _webDemoUrl = BlogPostConstants.PortalTutorial.WebDemoUrl;
  
  protected _title = BlogPostConstants.PortalTutorial.Title
  protected _subtitle = BlogPostConstants.PortalTutorial.Subtitle;
  protected _description = BlogPostConstants.PortalTutorial.Description;
  protected _keywords = BlogPostConstants.PortalTutorial.Keywords;

  //----------------------------//

  constructor() {
    console.log('constructor');
    // this._iconsService.registerIcons();
    this._seoService.updateMetadata({
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords:  BlogPostConstants.PortalTutorial.Keywords
    });
  }


} //Cls
