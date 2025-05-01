import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatEverythingModule } from '@spider-baby/mat-notifications/utils';

@Component({
  selector: 'sb-toast-mat',
  imports: [MatEverythingModule],
  template: ``,
  styles: `
    :host {
      display: block;
    }    
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbMatToastModalComponent {
  private _snackBar = inject(MatSnackBar);


  @Input()
  public set toastMsg(msg: string | null | undefined) {
    if (!msg) return;
    this._snackBar.open(msg, 'OK');
  }

}
