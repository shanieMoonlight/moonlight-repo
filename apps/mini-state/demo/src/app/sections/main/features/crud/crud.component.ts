import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniCrudState } from '@spider-baby/mini-state';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { DataTableComponent } from '../../ui/table/data-table.component';

@Component({
  selector: 'sb-manual-crud',
  imports: [
    MatEverythingModule,
    DataTableComponent,
    SbMatNotificationsModalComponent
  ],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudComponent {

  private _ioService = inject(DummyAlbumIoService)

  //- - - - - - - - - - - - - //

  protected displayColumns = signal(['id', 'userId', 'title'])

  //- - - - - - - - - - - - - //

  protected _crudState = MiniCrudState
    .Create(() => this._ioService.getAll())
    .setAddState(
      (album: Album) => this._ioService.create(album),
      (album) => `Album  ${album.title} added!`)
    .setUpdateState(
      (album: Album) => this._ioService.update(album),
      (album) => `⭐⭐⭐ \r\n Album ${album.title} updated successfully! \r\n⭐⭐⭐`)
    .setDeleteState(
      (album: Album) => this._ioService.delete(album.id!),
      (album) =>  `Album ${album.title} deleted successfully 🗑️
      You will have to imagine that it was removed from the list.
      This is a simple demo, not a real CRUD app. ¯\\_(ツ)_/¯`
    ).trigger(undefined)


  //- - - - - - - - - - - - - //

  protected _data = computed(() => this._crudState.data() ?? [])
  protected _successMsg = this._crudState.successMsg
  protected _errorMsg = this._crudState.errorMsg
  protected _loading = this._crudState.loading

  //--------------------------//

  protected refresh = () =>
    this._crudState.trigger(undefined)

  protected onViewDetails = (album: Album) =>
    console.log('View details for album:', album)

  protected onEditItem = (album: Album) =>
    this._crudState.triggerUpdate(album)

  protected onDeleteItem = (album: Album) =>
    this._crudState.triggerDelete(album)
  
  protected onAddItem = (album: Album) =>
    this._crudState.triggerAdd(album)

  //--------------------------//

}//Cls

