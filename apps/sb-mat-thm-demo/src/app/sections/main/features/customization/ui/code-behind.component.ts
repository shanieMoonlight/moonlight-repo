import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SbCodeTabsTsHtmlComponentCodeComponent } from '@spider-baby/ui-code-samples'
import { CUSTOMIZATION_COMPONENT_HTML_CODE, CUSTOMIZATION_COMPONENT_TS_CODE } from '../generated/customization-code'
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'sb-customization-code-behind',
  imports: [
    MatEverythingModule,
    SbCodeTabsTsHtmlComponentCodeComponent
  ],
  template: `
  <sb-code-tabs-ts-html
    [html]="_htmlCode()"
    [typescript]="_tsCode()"/>

  <button mat-button
    (click)="close()">
    Close
  </button>
    `,

  styles: `
    :host {
      display: flex;
      flex-direction: column;
      padding: 1rem;
    }
    button{
      margin-top: auto;
      margin-left: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizationCodeBehindComponent {

  private _dialogRef = inject(MatDialogRef<CustomizationCodeBehindComponent>, { optional: true });

  _htmlCode = signal<string>(CUSTOMIZATION_COMPONENT_HTML_CODE);
  _tsCode = signal<string>(CUSTOMIZATION_COMPONENT_TS_CODE);
  // _htmlCode = signal<string>('html code');
  // _tsCode = signal<string>('ts code');

  close = () =>
    this._dialogRef?.close()

}
