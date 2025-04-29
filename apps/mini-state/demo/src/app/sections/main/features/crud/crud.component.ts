import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniCrudState } from '@spider-baby/mini-state';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { AlbumFormModalComponent, NewAlbumDialogData } from '../../ui/album/form-modal/form-modal.component';
import { DataTableComponent } from '../../ui/table/data-table.component';
import { MainDemoHeaderComponent } from '../../ui/demo-header/demo-header.component';
import { MainDemoCodeComponent } from '../../ui/demo-code/demo-code.component';

@Component({
  selector: 'sb-main-demo-crud',
  imports: [
    MatEverythingModule,
    DataTableComponent,
    SbMatNotificationsModalComponent,
    MainDemoHeaderComponent,
    MainDemoCodeComponent
  ],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoCrudComponent {

  private _dialog = inject(MatDialog);
  private _ioService = inject(DummyAlbumIoService)

  //- - - - - - - - - - - - - //

  protected displayColumns = signal(['id', 'userId', 'title'])

  //- - - - - - - - - - - - - //

  private _crudState = MiniCrudState
    .Create<void, Album>(() => this._ioService.getAll())
    .setAddState(
      (album: Album) => this._ioService.create(album),
      (album) => `Album  ${album.title} added!`)
    .setUpdateState(
      (album: Album) => this._ioService.update(album),
      (album) => `⭐⭐⭐ \r\n Album ${album.title} updated successfully! \r\n⭐⭐⭐`)
    .setDeleteState(
      (album: Album) => this._ioService.delete(album.id!),
      (album) => `Album ${album.title} deleted successfully 🗑️
      You will have to imagine that it was removed from the list.
      This is a simple demo, not a real CRUD app. ¯\\_(ツ)_/¯`
    ).trigger()

  protected _data = computed(() => this._crudState.data() ?? [])
  protected _successMsg = this._crudState.successMsg
  protected _errorMsg = this._crudState.errorMsg
  protected _loading = this._crudState.loading

  //--------------------------//

  protected refresh = () =>
    this._crudState.trigger()


  protected onDeleteItem = (album: Album) =>
    this._crudState.triggerDelete(album)


  protected openAddAlbumDialog = () =>
    this.openAlbumDialog()
      .afterClosed()
      .subscribe((album) =>
        album && this._crudState.triggerAdd(album)
      )

  protected openEditAlbumDialog = (album: Album) =>
    this.openAlbumDialog(album)
      .afterClosed()
      .subscribe((updatedAlbum) =>
        updatedAlbum && this._crudState.triggerUpdate(updatedAlbum)
      )

  //--------------------------//

  private openAlbumDialog(album?: Album): MatDialogRef<AlbumFormModalComponent, Album | undefined> {
    console.log('openAddAlbumDialog');
    return this._dialog.open(AlbumFormModalComponent, {
      width: '600px',
      data: new NewAlbumDialogData(album), // Pass any initial data if needed
    });
  }

  //--------------------------//

  protected _tsCode = signal(`
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniCrudState } from '@spider-baby/mini-state';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { AlbumFormModalComponent, NewAlbumDialogData } from '../../ui/album/form-modal/form-modal.component';
import { DataTableComponent } from '../../ui/table/data-table.component';

@Component({
  selector: 'sb-main-demo-crud',
  imports: [
    MatEverythingModule,
    DataTableComponent,
    SbMatNotificationsModalComponent
  ],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoCrudComponent {

  private _dialog = inject(MatDialog);
  private _ioService = inject(DummyAlbumIoService)
  

  protected displayColumns = signal(['id', 'userId', 'title'])

  //- - - - - - - - - - - - - //

  private _crudState = MiniCrudState
    .Create<void, Album>(() => this._ioService.getAll())
    .setAddState(
      (album: Album) => this._ioService.create(album),
      (album) => \`Album  \${album.title} added!\`)
    .setUpdateState(
      (album: Album) => this._ioService.update(album),
      (album) => \`⭐⭐⭐ \\r\\n Album \${album.title} updated successfully! \\r\\n⭐⭐⭐\`)
    .setDeleteState(
      (album: Album) => this._ioService.delete(album.id!),
      (album) => \`Album \${album.title} deleted successfully 🗑️
      You will have to imagine that it was removed from the list.
      This is a simple demo, not a real CRUD app. ¯\\_(ツ)_/¯\`
    ).trigger()

  //- - - - - - - - - - - - - //

  protected _data = computed(() => this._crudState.data() ?? [])
  protected _successMsg = this._crudState.successMsg
  protected _errorMsg = this._crudState.errorMsg
  protected _loading = this._crudState.loading

  //--------------------------//

  protected refresh = () =>
    this._crudState.trigger()


  protected onDeleteItem = (album: Album) =>
    this._crudState.triggerDelete(album)


  protected openAddAlbumDialog = () =>
    this.openAlbumDialog()
      .afterClosed()
      .subscribe((album) =>
        album && this._crudState.triggerAdd(album)
      )

  protected openEditAlbumDialog = (album: Album) =>
    this.openAlbumDialog(album)
      .afterClosed()
      .subscribe((updatedAlbum) =>
        updatedAlbum && this._crudState.triggerUpdate(updatedAlbum)
      )

  //--------------------------//

  private openAlbumDialog(album?: Album): MatDialogRef<AlbumFormModalComponent, Album | undefined> {
    console.log('openAddAlbumDialog');
    return this._dialog.open(AlbumFormModalComponent, {
      width: '600px',
      data: new NewAlbumDialogData(album), // Pass any initial data if needed
    });
  }
    
}`);
    
      protected _htmlCode = signal(`<div class='content-container'>
    
    <div class="content-container">
      <sb-data-table 
        [data]="_data()" 
        [displayColumns]="displayColumns()"
        [isLoading]="_loading()" 
        [includeActions]="true"
        [title]="'Album Collection'"
        [emptyMessage]="'No albums found. Try refreshing the data.'"
        [loadingMessage]="'Loading albums...'"
        [itemName]="'album'"
        [iconName]="'album'"
        [canAddItem]="true"
        (refresh)="refresh()"
        (addItem)="openAddAlbumDialog()"
        (editItem)="openEditAlbumDialog($event)"
        (deleteItem)="onDeleteItem($event)"/>
  </div>


  <sb-notifications-modal-mat
      [errorMsg]="_errorMsg()"
      [successMsg]="_successMsg()" 
      [successMsg]="_successMsg()" 
      [isLoading]="_loading()" 
      [loadingMessage]="'Loading albums...'"/>
    `);

}//Cls

