import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { ErrorModalComponent } from '../../ui/modals/error/error.component';
import { LoaderModalComponent } from '../../ui/modals/loader/loader.component';
import { SuccessModalComponent } from '../../ui/modals/success/success.component';
import { DataTableComponent } from '../../ui/table/data-table.component';

@Component({
  selector: 'sb-manual-crud',
  imports: [
    MatEverythingModule,
    ErrorModalComponent,
    SuccessModalComponent,
    DataTableComponent,
    LoaderModalComponent
  ],
  templateUrl: './manual-crud.component.html',
  styleUrl: './manual-crud.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualCrudComponent {

  private _ioService = inject(DummyAlbumIoService)

  //- - - - - - - - - - - - - //

  protected displayColumns = signal(['id', 'userId', 'title'])
  
  //- - - - - - - - - - - - - //

  protected _getAllState = MiniStateBuilder
    .Create(() => this._ioService.getAll())
    .trigger()

  protected _updateState = MiniStateBuilder
    .CreateWithInput((album: Album) => this._ioService.update(album))
    .setSuccessMsgFn((album: Album) => `⭐⭐⭐ \r\n Album ${album.title} updated successfully! \r\n⭐⭐⭐`)


  protected _deleteState = MiniStateBuilder
    .CreateWithInput((album: Album) => this._ioService.delete(album.id))
    .setSuccessMsgFn((album: Album) => `Album ${album.title} deleted successfully 🗑️
     You will have to imagine that it was removed from the list.
     This is a simple demo, not a real CRUD app. ¯\\_(ツ)_/¯`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Create(
    this._getAllState,
    this._updateState,
    this._deleteState,
  )

  protected _data = computed(() => this._getAllState.data() ?? [])
  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading

  //--------------------------//

  protected refresh = () =>
    this._getAllState.trigger()

  protected onViewDetails = (album: Album) =>
    console.log('View details for album:', album)

  protected onEditItem = (album: Album) =>
    this._updateState.trigger(album)

  protected onDeleteItem = (album: Album) =>
    this._deleteState.trigger(album)

  //--------------------------//

}//Cls

