import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeoService } from '@spider-baby/utils-seo';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HighlightModule } from 'ngx-highlightjs';
import { HubAppImages } from '@sb-hub/core-config/images';

// Import code samples
import { DirectiveBasicCode } from './code/directive-basic';
import { DirectiveImplementationCode } from './code/directive-implementation';
import { ImageLoadingCode } from './code/image-loading';
import { ComponentBasicCode } from './code/component-basic';
import { ComponentTemplateCode } from './code/component-template';
import { ComponentStyleCode } from './code/component-style';
import { UsageExampleCode } from './code/usage-example';
import { PredefinedFunctionsCode } from './code/predefined-functions';
import { BlogConstants } from './config/constants';
// Commented out as it's not used in the template currently
// import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
import { FallBackConstsTsCode } from './code/fallback-consts';
import { 
  BasicUsageExample,
  TransformFunctionExample,
  ViewTransitionsExample,
  FallbackImageExample,
  ObjectFitExample,
  PredefinedFunctionsExample,
  PredefinedFunctionsTemplateExample
} from './code/html-examples';
import { FallbackInputCode } from './code/fallback-input';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatEverythingModule,
    RouterModule,
    HighlightModule
    // Commented out as it's not used in the template currently
    // HubHeroBanner2Component
  ],
  providers: [],
  selector: 'sb-hub-blog-features-prog-img-tutorial',
  templateUrl: './prog-img-tutorial.component.html',
  styleUrl: './prog-img-tutorial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogProgImgTutorialComponent {
 
  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  //- - - - - - - - - - - - - - -//
  
  // Title and SEO properties
  protected _title = BlogConstants.ProgImgTutorial.Title;
  protected _subtitle = BlogConstants.ProgImgTutorial.Subtitle;
  protected _description = BlogConstants.ProgImgTutorial.Description;

  // Code samples for displaying in the tutorial  // Code samples from Typescript files
  protected readonly _directiveBasicCode = DirectiveBasicCode;
  protected readonly _directiveImplementationCode = DirectiveImplementationCode;
  protected readonly _imageLoadingCode = ImageLoadingCode;
  protected readonly _componentBasicCode = ComponentBasicCode;
  protected readonly _componentTemplateCode = ComponentTemplateCode;
  protected readonly _componentStyleCode = ComponentStyleCode;
  protected readonly _usageExampleCode = UsageExampleCode;
  protected readonly _predefinedFunctionsCode = PredefinedFunctionsCode;
  protected readonly _fallbackConsts = FallBackConstsTsCode;
    // HTML code examples (extracted from the template)
  protected readonly _basicUsageExample = BasicUsageExample;
  protected readonly _transformFunctionExample = TransformFunctionExample;
  protected readonly _viewTransitionsExample = ViewTransitionsExample;
  protected readonly _fallbackImageExample = FallbackImageExample;
  protected readonly _objectFitExample = ObjectFitExample;
  protected readonly _predefinedFunctionsExample = PredefinedFunctionsExample;
  protected readonly _predefinedFunctionsTemplateExample = PredefinedFunctionsTemplateExample;
  protected readonly _fallbackInputCode = FallbackInputCode;

  protected readonly _bannerImg =  HubAppImages.Blog.ProgImgsTutorial_1.placeholder;

  // Demo state
  protected _showDemo = signal(false);
  protected readonly _githubRepo = BlogConstants.ProgImgTutorial.GithubRepo;
  
  // Create a transition ID for the component based on the current route
  protected _transitionId = computed(() => this._router.url);

  //----------------------------//
  constructor() {
    this._seoService.updateMetadata({
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Progressive Images', 'Image Loading', 'Performance', 'User Experience'],
    });
    
    // Access static data from route
    const routeData = this._route.snapshot.data;
    if (routeData['showDemo']) {
      setTimeout(() => this._showDemo.set(true), 1000);
    }
  }


} //Cls
