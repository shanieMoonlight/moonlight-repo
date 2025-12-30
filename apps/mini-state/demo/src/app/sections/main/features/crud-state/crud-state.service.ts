import { computed, inject, Injectable } from '@angular/core';
import { MiniCrudStateBuilder } from '@spider-baby/mini-state';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';

@Injectable() //Not provided in the root. We only want it in MainDemoCrudWithSeparateStateComponent
export class CrudStateService {

  private _ioService = inject(DummyAlbumIoService)

  //- - - - - - - - - - - - - //

  private _crudState = MiniCrudStateBuilder
    .Create<void, Album>(() => this._ioService.getAll())
    .setAddState(
      (album) => this._ioService.create(album),
      (album) => `Album  ${album.title} added!`)
    .setUpdateState(
      (album) => this._ioService.update(album),
      (album) => `⭐⭐⭐ \r\n Album ${album.title} updated successfully! \r\n⭐⭐⭐`)
    .setDeleteState(
      (album: Album) => this._ioService.delete(album.id!),
      (album) => `Album ${album.title} deleted successfully 🗑️
      You will have to imagine that it was removed from the list.
      This is a simple demo, not a real CRUD app. ¯\\_(ツ)_/¯`)
    .build()

  data = computed(() => this._crudState.data() ?? [])
  successMsg = this._crudState.successMsg
  errorMsg = this._crudState.errorMsg
  loading = this._crudState.loading

  //- - - - - - - - - - - - - //

  refresh = () =>
    this._crudState.triggerGetAll()

  addItem = (album: Album) =>
    this._crudState.triggerAdd(album)

  deleteItem = (album: Album) =>
    this._crudState.triggerDelete(album)

  updateItem = (album: Album) =>
    this._crudState.triggerUpdate(album)
}




///#############################################//

export const TS_CRUD_STATE_SERVICE_CODE = `
//Example using separate state class for readability and maintainability
//This is provided in the component itself, not in the root module. 

import { computed, inject, Injectable } from '@angular/core';
import { MiniCrudState } from '@spider-baby/mini-state';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';

@Injectable() //Not provided in the root. We only want it in MainDemoCrudWithSeparateStateComponent
export class CrudStateService {

    private _ioService = inject(DummyAlbumIoService)

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
        (album) => \`Album \${album.title} deleted successfully 🗑️\`)
      .trigger()

    data = computed(() => this._crudState.data() ?? [])
    successMsg = this._crudState.successMsg
    errorMsg = this._crudState.errorMsg
    loading = this._crudState.loading
    
    //- - - - - - - - - - - - - //

    refresh = () =>
      this._crudState.trigger()

    addItem = (album: Album) =>
      this._crudState.triggerAdd(album)

    deleteItem = (album: Album) =>
      this._crudState.triggerDelete(album)

    updateItem = (album: Album) =>
      this._crudState.triggerDelete(album)
  }
    
}`

///#############################################//