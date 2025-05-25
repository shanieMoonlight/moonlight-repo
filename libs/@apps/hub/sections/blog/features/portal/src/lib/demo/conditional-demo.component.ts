import { ChangeDetectionStrategy, Component, TemplateRef, viewChild } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { SbPortalInputComponent, SbPortalOutletComponent } from '@spider-baby/utils-portal';

@Component({
  selector: 'sb-hub-blog-portal-conditional-demo',
  standalone: true,
  imports: [
    MatEverythingModule,
    SbPortalInputComponent,
    SbPortalOutletComponent
  ],
  templateUrl: './conditional-demo.component.html',
  styleUrl: './conditional-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbHubBlogPortalConditionalDemoComponent {

  protected _demoTemplate1 = viewChild.required<TemplateRef<unknown>>('demoPortalTemplate1')
  protected _demoTemplate2 = viewChild.required<TemplateRef<unknown>>('demoPortalTemplate2')


  protected _selectedPortal?: TemplateRef<unknown>

  

  protected showTemplate1 = () =>
    this._selectedPortal = this._demoTemplate1()

  protected showTemplate2 = () =>
    this._selectedPortal = this._demoTemplate2()

  protected hidePortal = () =>
    this._selectedPortal = undefined;

}

