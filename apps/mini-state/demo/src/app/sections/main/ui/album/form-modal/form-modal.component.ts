import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { Album } from '../../../data/album';
import { AlbumFormComponent } from '../form/album-form.component';

//##########################################//

// Interface for the expected dialog data
export class NewAlbumDialogData {  
  constructor(public album?: Album) {    
  }
}

//##########################################//
@Component({
  selector: 'sb-album-form-modal',
  standalone: true,
  imports: [
    MatEverythingModule,
    ReactiveFormsModule,
    AlbumFormComponent,
  ],
  templateUrl: './form-modal.component.html',
  styleUrl: './form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumFormModalComponent {

  private _dialogData: NewAlbumDialogData = inject(MAT_DIALOG_DATA, { optional: true });
  private _dialogRef = inject(MatDialogRef<AlbumFormModalComponent>, { optional: true });
  
  //- - - - - - - - - - - - - //

  _album = this._dialogData.album

  //--------------------------//

  closeDialog = (album?: Album) =>
    this._dialogRef?.close(album)

  //--------------------------//

}//Cls
