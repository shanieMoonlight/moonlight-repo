import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { SbCodeTabsTsHtmlComponentCodeComponent } from '@spider-baby/ui-code-samples';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { map, merge, scan, shareReplay } from 'rxjs';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { MainDemoHeaderComponent } from '../../ui/demo-header/demo-header.component';
import { DataTableComponent } from '../../ui/table/data-table.component';


///#############################################//

const TS_CODE = `
//Example using MiniStateCombined 

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { DataTableComponent } from '../../ui/table/data-table.component';

@Component({
  selector: 'sb-main-demo-combined',
  imports: [
    MatEverythingModule,
    DataTableComponent,
    SbMatNotificationsModalComponent
],
  templateUrl: './combined.component.html',
  styleUrl: './combined.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoCombinedComponent {

  private _ioService = inject(DummyAlbumIoService)

  //- - - - - - - - - - - - - //

  protected displayColumns = signal(['id', 'userId', 'title'])

  //- - - - - - - - - - - - - //

  //##############################################################################################
  //  All this can be done easier with MiniCrudState, but this is to demonstrate MiniStateCombined
  //##############################################################################################
  
  private _getAllState = MiniStateBuilder
    .Create(() => this._ioService.getAll())
    .trigger()//Trigger immediately
    
    private _updateState = MiniStateBuilder
  .CreateWithInput((album: Album) => this._ioService.update(album))
  .setSuccessDataProcessorFn((album: Album) =>{ return{...album, title: album.title + ' (updated)'}}) //<-- Added to simulate updated data in UI (Dummy service does not actually update data)
  .setSuccessMsgFn((album: Album) => \`⭐⭐⭐ \\r\\n Album \${album.title} updated successfully! \\r\\n⭐⭐⭐\`)


  private _deleteState = MiniStateBuilder
    .CreateWithInput((album: Album) => this._ioService.delete(album.id!))
    .setSuccessMsgFn((album: Album) => \`Album \${album.title} deleted successfully 🗑️\`)

  private _states = MiniStateCombined.Combine(
    this._getAllState,
    this._updateState,
    this._deleteState)

    protected _successMsg = this._states.successMsg
    protected _errorMsg = this._states.errorMsg
    protected _loading = this._states.loading

  //- - - - - - - - - - - - - //

  //Combine for messages and loaders (not data as they have different return types)
  private _states = MiniStateCombined.Combine(
    this._getAllState,
    this._updateState,
    this._deleteState)

  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading

  //For display purposes
  protected _deleteData = this._deleteState.data
  protected _editData = this._updateState.data


 _albums$ = merge(
    this._getAllState.data$.pipe(map(all => ({ type: 'base' as const, payload: all }))),
    this._updateState.data$.pipe(map(item => ({ type: 'update' as const, payload: item }))),
    this._deleteState.data$.pipe(map(item => ({ type: 'delete' as const, payload: item })))
  ).pipe(
    scan((state: Album[], action) => {  // Actions come in, album array goes out! 
                                        // The state (album array) is accumulated/persisted here, so we are always working with the latest data      
      if (!action) return state;
      
      switch (action.type) {
        case 'base':
          // authoritative reset
          return [...action.payload]
        case 'update':
          return state.map(a =>
            String(a.id) === String(action.payload.id) ? { ...a, ...action.payload } : a
          );
        case 'delete':
          return state.filter(a => String(a.id) !== String(action.payload.id));
        default:
          return state;
      }
    }, [] as Album[])
  );

  // expose as a Signal for template binding
  protected _albums = toSignal(this._albums$, { initialValue: [] as Album[] });

  //--------------------------//

  protected refresh = () =>
    this._getAllState.trigger()

  protected onEditItem = (album: Album) =>
    this._updateState.trigger(album)

  protected onDeleteItem = (album: Album) =>
    this._deleteState.trigger(album)
    
}`

///#############################################//

const HTML_CODE = `
      

   <div class="content-container">
    <sb-data-table 
      [data]="_albums()" 
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

<H4 class="recent-data">Last deleted: </H4>
<H5 class="recent-data">{{_deleteData() | json}}</H5>
<br>
<H4 class="recent-data">Last updated: </H4>
<H5 class="recent-data">{{_editData() | json}}</H5>

<sb-notifications-modal-mat
    [errorMsg]="_errorMsg()"
    [successMsg]="_successMsg()" 
    [isLoading]="_loading()" 
    [loadingMessage]="'Loading albums...'"/>
    `

///#############################################//


@Component({
  selector: 'sb-main-demo-combined',
  standalone: true,
  imports: [
    MatEverythingModule,
    DataTableComponent,
    SbMatNotificationsModalComponent,
    MainDemoHeaderComponent,
    SbCodeTabsTsHtmlComponentCodeComponent,
    JsonPipe
  ],
  templateUrl: './combined.component.html',
  styleUrl: './combined.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoCombinedComponent {

  private _ioService = inject(DummyAlbumIoService)

  //- - - - - - - - - - - - - //

  protected displayColumns = signal(['id', 'userId', 'title'])

  //- - - - - - - - - - - - - //

  //##############################################################################################
  //  All this can be done easier with MiniCrudState, but this is to demonstrate MiniStateCombined
  //##############################################################################################

 private _getAllState = MiniStateBuilder
    .Create(() => this._ioService.getAll())
    .trigger()

  private _updateState = MiniStateBuilder
    .CreateWithInput((album: Album) => this._ioService.update(album))
    .setSuccessDataProcessorFn((album: Album) => { return { ...album, title: album.title + ' (updated)' } }) //<-- Added to simulate updated data in UI (Dummy service does not actually update data)
    .setSuccessMsgFn((album: Album) => `⭐⭐⭐ \r\n Album ${album.title} updated successfully! \r\n⭐⭐⭐`)

  //Helper function to delete and return the album for updating the state and ui
  private deleteAndReturnAlbum = (album: Album) =>
    this._ioService.delete(album.id!).pipe(map(() => album))
  private _deleteState = MiniStateBuilder
    .CreateWithInput((album: Album) => this.deleteAndReturnAlbum(album))
    .setSuccessMsgFn((album: Album) => `Album ${album.title} deleted successfully 🗑️`)

  //- - - - - - - - - - - - - //

  //Combine for messages and loaders (not data as they have different return types)
  private _states = MiniStateCombined.Combine(
    this._getAllState,
    this._updateState,
    this._deleteState)

  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading

  //For display purposes
  protected _deleteData = this._deleteState.data
  protected _editData = this._updateState.data


 private readonly  _albums$ = merge(
    this._getAllState.data$.pipe(map(all => ({ type: 'base' as const, payload: all }))),
    this._updateState.data$.pipe(map(item => ({ type: 'update' as const, payload: item }))),
    this._deleteState.data$.pipe(map(item => ({ type: 'delete' as const, payload: item })))
  ).pipe(
    scan((state: Album[], action) => {  // Actions come in, album array goes out! 
      // The state (album array) is accumulated/persisted here, so we are always working with the latest data      
      if (!action) return state;

      switch (action.type) {
        case 'base':
          // authoritative reset
          return [...action.payload]
        case 'update':
          return state.map(a =>
            String(a.id) === String(action.payload.id) ? { ...a, ...action.payload } : a
          );
        case 'delete':
          return state.filter(a => String(a.id) !== String(action.payload.id));
        default:
          return state;
      }
    }, [] as Album[]),
    shareReplay(1) //prevent rescans on multiple subscriptions
  );

  // expose as a Signal for template binding
  protected _albums = toSignal(this._albums$, { initialValue: [] as Album[] });

  //--------------------------//

  protected refresh = () =>
    this._getAllState.trigger()

  protected onEditItem = (album: Album) =>
    this._updateState.trigger(album)

  protected onDeleteItem = (album: Album) =>
    this._deleteState.trigger(album)

  //--------------------------//

  protected _tsCode = signal(TS_CODE);

  protected _htmlCode = signal(HTML_CODE);
}