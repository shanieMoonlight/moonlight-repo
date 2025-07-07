import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
// import { BlogConstants } from '../config/constants';
import { FirstErrorDirective } from '@spider-baby/utils-forms';
import { FirstErrorComponent } from '@spider-baby/utils-forms';
import { SbHubPkgLinksComponent } from '@sb-hub/shared-ui/pkg-links';
import { MatDivider } from '@angular/material/divider';
// Import code samples
import { BasicFirstErrorExample, CustomErrorTemplateExample, ShowUntouchedExample } from './code/first-error-examples';
import { DynamicFormExample, CustomErrorMessagesExample } from './code/advanced-patterns';
import { BlogConstants } from './config/constants';
import { FirstErrorDemoComponent } from './demo.component';

@Component({
  selector: 'sb-hub-blog-features-first-error',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HighlightModule,
    FirstErrorDirective,
    FirstErrorComponent,
    SbHubPkgLinksComponent,
    MatDivider,
    FirstErrorDemoComponent
  ],
  templateUrl: './first-error.component.html',
  styleUrl: './first-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogFirstErrorComponent {
  // SEO and tutorial metadata
  protected _title = BlogConstants.FirstErrorTutorial.Title;
  protected _subtitle = BlogConstants.FirstErrorTutorial.Subtitle;
  protected _description = BlogConstants.FirstErrorTutorial.Description;
  protected _gitHubRepoUrl = BlogConstants.FirstErrorTutorial.GitHubRepo;
  protected _npmPackageUrl = BlogConstants.FirstErrorTutorial.NpmPackage;

  // Code samples
  protected readonly _basicExample = BasicFirstErrorExample;
  protected readonly _customTemplateExample = CustomErrorTemplateExample;
  protected readonly _showUntouchedExample = ShowUntouchedExample;
  protected readonly _dynamicFormExample = DynamicFormExample;
  protected readonly _customErrorMessagesExample = CustomErrorMessagesExample;
}
