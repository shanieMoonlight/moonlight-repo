import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { DataTableComponent } from '../../ui/table/data-table.component';
import { MainDemoHeaderComponent } from '../../ui/demo-header/demo-header.component';
import { MainDemoCodeComponent } from '../../ui/demo-code/demo-code.component';

@Component({
  selector: 'sb-main-demo-complex',
  imports: [
    MatEverythingModule,
    DataTableComponent,
    SbMatNotificationsModalComponent,
    MainDemoHeaderComponent,
    MainDemoCodeComponent
],
  templateUrl: './complex.component.html',
  styleUrl: './complex.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoComplexComponent {

  private _ioService = inject(DummyAlbumIoService)

  //- - - - - - - - - - - - - //

  protected displayColumns = signal(['id', 'userId', 'title'])

  //- - - - - - - - - - - - - //

  private _getAllState = MiniStateBuilder
    .Create(() => this._ioService.getAll())
    .trigger()
    
    private _updateState = MiniStateBuilder
  .CreateWithInput((album: Album) => this._ioService.update(album))
  .setSuccessMsgFn((album: Album) => `⭐⭐⭐ \r\n Album ${album.title} updated successfully! \r\n⭐⭐⭐`)


  private _deleteState = MiniStateBuilder
    .CreateWithInput((album: Album) => this._ioService.delete(album.id!))
    .setSuccessMsgFn((album: Album) => `Album ${album.title} deleted successfully 🗑️
     You will have to imagine that it was removed from the list.
     This is a simple demo, not a real CRUD app. ¯\\_(ツ)_/¯`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._getAllState,
    this._updateState,
    this._deleteState)

  protected _data = computed(() => this._getAllState.data() ?? [])
  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading

  //--------------------------//

  protected refresh = () =>
    this._getAllState.trigger()

  protected onEditItem = (album: Album) =>
    this._updateState.trigger(album)

  protected onDeleteItem = (album: Album) =>
    this._deleteState.trigger(album)

  //--------------------------//

  protected _tsCode = signal(`
//Example using MiniStateCombined 

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { DataTableComponent } from '../../ui/table/data-table.component';

@Component({
  selector: 'sb-main-demo-complex',
  imports: [
    MatEverythingModule,
    DataTableComponent,
    SbMatNotificationsModalComponent
],
  templateUrl: './complex.component.html',
  styleUrl: './complex.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoComplexComponent {

  private _ioService = inject(DummyAlbumIoService)

  //- - - - - - - - - - - - - //

  protected displayColumns = signal(['id', 'userId', 'title'])

  //- - - - - - - - - - - - - //

  private _getAllState = MiniStateBuilder
    .Create(() => this._ioService.getAll())
    .trigger()//Trigger immediately
    
    private _updateState = MiniStateBuilder
  .CreateWithInput((album: Album) => this._ioService.update(album))
  .setSuccessMsgFn((album: Album) => \`⭐⭐⭐ \\r\\n Album \${album.title} updated successfully! \\r\\n⭐⭐⭐\`)


  private _deleteState = MiniStateBuilder
    .CreateWithInput((album: Album) => this._ioService.delete(album.id!))
    .setSuccessMsgFn((album: Album) => \`Album \${album.title} deleted successfully 🗑️
     You will have to imagine that it was removed from the list.
     This is a simple demo, not a real CRUD app. ¯\\_(ツ)_/¯\`)

  private _states = MiniStateCombined.Combine(
    this._getAllState,
    this._updateState,
    this._deleteState)

  protected _data = computed(() => this._getAllState.data() ?? [])
  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading

  //- - - - - - - - - - - - - //

  protected refresh = () =>
    this._getAllState.trigger()

  protected onEditItem = (album: Album) =>
    this._updateState.trigger(album)

  protected onDeleteItem = (album: Album) =>
    this._deleteState.trigger(album)
    
}`);
    
      protected _htmlCode = signal(`
      

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
          (refresh)="refresh()"
          (editItem)="onEditItem($event)"
          (deleteItem)="onDeleteItem($event)"/>
    </div>
    
    
    
    <sb-notifications-modal-mat
        [errorMsg]="_errorMsg()"
        [successMsg]="_successMsg()" 
        [isLoading]="_loading()" 
        [loadingMessage]="'Loading albums...'"/>
    `);
    }