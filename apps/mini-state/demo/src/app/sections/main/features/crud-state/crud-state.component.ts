import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { Album } from '../../data/album';
import { AlbumFormModalComponent, NewAlbumDialogData } from '../../ui/album/form-modal/form-modal.component';
import { MainDemoHeaderComponent } from '../../ui/demo-header/demo-header.component';
import { DataTableComponent } from '../../ui/table/data-table.component';
import { CrudStateService } from './crud-state.service';

@Component({
  selector: 'sb-main-demo-crud-with-state',
  standalone: true,
  imports: [
    MatEverythingModule,
    DataTableComponent,
    SbMatNotificationsModalComponent,
    MainDemoHeaderComponent
  ],
  providers: [CrudStateService],
  templateUrl: './crud-state.component.html',
  styleUrl: './crud-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoCrudWithSeparateStateComponent {

  private _dialog = inject(MatDialog);
  private _state = inject(CrudStateService)

  //- - - - - - - - - - - - - //

  protected displayColumns = signal(['id', 'userId', 'title'])

  protected _data = this._state.data  
  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading

  //--------------------------//

  protected refresh = () =>
    this._state.refresh()


  protected onDeleteItem = (album: Album) =>
    this._state.deleteItem(album)


  protected openAddAlbumDialog = () =>
    this.openAlbumDialog()
      .afterClosed()
      .subscribe((album) =>
        album && this._state.addItem(album)
      )

  protected openEditAlbumDialog = (album: Album) =>
    this.openAlbumDialog(album)
      .afterClosed()
      .subscribe((updatedAlbum) =>
        updatedAlbum && this._state.updateItem(updatedAlbum)
      )

  //--------------------------//

  private openAlbumDialog(album?: Album): MatDialogRef<AlbumFormModalComponent, Album | undefined> {
    console.log('openAddAlbumDialog');
    return this._dialog.open(AlbumFormModalComponent, {
      width: '600px',
      data: new NewAlbumDialogData(album), // Pass any initial data if needed
    })

  }
}//Cls



///#############################################//

export const TS_CRUD_STATE_COMPONENT_CODE = `
//Example using separate state class for readability and maintainability
//This is provided in the component itself, not in the root module. 
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { Album } from '../../data/album';
import { AlbumFormModalComponent, NewAlbumDialogData } from '../../ui/album/form-modal/form-modal.component';
import { DataTableComponent } from '../../ui/table/data-table.component';
import { CrudStateService } from './crud-state.service';

@Component({
  selector: 'sb-main-demo-crud-with-state',
  imports: [
    MatEverythingModule,
    DataTableComponent,
    SbMatNotificationsModalComponent
  ],
  providers: [CrudStateService], //<---- This is the key part, providing the state service here
                                 // This is also import if you want to access the ActivatedRooute form the state service   
  templateUrl: './crud-state.component.html',
  styleUrl: './crud-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoCrudWithSeparateStateComponent {

  private _dialog = inject(MatDialog);
  private _state = inject(CrudStateService);

  //- - - - - - - - - - - - - //

  protected displayColumns = signal(['id', 'userId', 'title'])

  protected _data = this._state.data  
  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading

  //- - - - - - - - - - - - - //

  protected refresh = () =>
    this._state.refresh()


  protected onDeleteItem = (album: Album) =>
    this._state.deleteItem(album)


  protected openAddAlbumDialog = () =>
    this.openAlbumDialog()
      .afterClosed()
      .subscribe((album) =>
        album && this._state.addItem(album)
      )

  protected openEditAlbumDialog = (album: Album) =>
    this.openAlbumDialog(album)
      .afterClosed()
      .subscribe((updatedAlbum) =>
        updatedAlbum && this._state.updateItem(updatedAlbum)
      )

  //- - - - - - - - - - - - - //

  private openAlbumDialog(album?: Album): MatDialogRef<AlbumFormModalComponent, Album | undefined> {
    console.log('openAddAlbumDialog');
    return this._dialog.open(AlbumFormModalComponent, {
      width: '600px',
      data: new NewAlbumDialogData(album), // Pass any initial data if needed
    });
  }
}//Cls
    
`

///#############################################//