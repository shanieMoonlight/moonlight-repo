import { Component, inject, Input, OnInit } from '@angular/core';
import { MatEverythingModule } from '@moonlight/material-theming/utils';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BlobDownloadService } from '@moonlight/utils-download';

@Component({
  selector: 'ml-scss-display',
  standalone: true,
  imports: [MatEverythingModule],
  template: `
    <div class="dialog-content">
      <h2 mat-dialog-title>Generated SCSS</h2>
      
      <mat-dialog-content>
        <div class="scss-card">
          <pre>{{ scssContent }}</pre>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Close</button>
        <button mat-raised-button color="primary" (click)="downloadScss()">
          Download SCSS
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
    .dialog-content {
      padding: 0;
      max-height: 80vh;
    }
    .scss-card {
      padding: 16px;
      border-radius: 4px;
      overflow: auto;
      max-height: 60vh;
    }
    pre {
      margin: 0;
      font-family: monospace;
    }
    `,
  ],
})
export class ScssDisplayComponent implements OnInit {

  private _dialogRef = inject(MatDialogRef<ScssDisplayComponent>, { optional: true });
  private _dialogData = inject(MAT_DIALOG_DATA, { optional: true });
  private _downloader = inject(BlobDownloadService);

  //- - - - - - - - - - - - - - - -//

  @Input() scssContent = ''

  //-------------------------------//

  ngOnInit() {
    // If opened via dialog, use the data passed to the dialog
    if (this._dialogData?.scssContent && !this.scssContent)
      this.scssContent = this._dialogData.scssContent
  }

  //-------------------------------//

  downloadScss(): void {
    const content = this.scssContent;
    this._downloader.downloadScss(content, 'theme')

    // Close the dialog after download if in dialog mode
    if (this._dialogRef)
      this._dialogRef.close()
  }

  //-------------------------------//

}//Cls
