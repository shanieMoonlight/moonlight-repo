import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { DataTableComponent } from '../../ui/table/data-table.component';
import { MainConstants } from '../../config/constants';
import { MainDemoHeaderComponent } from '../../ui/demo-header/demo-header.component';
import { HighlightModule } from 'ngx-highlightjs';
import { MainDemoCodeComponent } from '../../ui/demo-code/demo-code.component';

@Component({
  selector: 'sb-main-demo-simple',
  imports: [
    MatEverythingModule,
    DataTableComponent,
    SbMatNotificationsModalComponent,
    MainDemoHeaderComponent,
    MainDemoCodeComponent
  ],
  templateUrl: './simple.component.html',
  styleUrl: './simple.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoSimpleComponent {

  private _ioService = inject(DummyAlbumIoService);

  //- - - - - - - - - - - - - //

  protected _failureRate = signal(MainConstants.API_FAILURE_RATE * 100);
  protected _displayColumns = signal(['id', 'userId', 'title']);

  protected _state = MiniStateBuilder
    .Create(() => this._ioService.getAll())
    .trigger();

  protected _data = computed(() => this._state.data() ?? []);
  protected _successMsg = this._state.successMsg;
  protected _errorMsg = this._state.errorMsg;
  protected _loading = this._state.loading;

  //--------------------------//

  protected refresh = () =>
    this._state.trigger();

  //--------------------------//

  protected _tsCode = signal(`import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';

@Component({
  selector: 'sb-main-demo-simple',
  templateUrl: './simple.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoSimpleComponent {

  private _ioService = inject(DummyAlbumIoService);
  

  protected _state = MiniStateBuilder
    .Create(() => this._ioService.getAll())
    .trigger();

  protected _data = computed(() => this._state.data() ?? []);


  protected refresh = () =>
    this._state.trigger();

}`);

  protected _htmlCode = signal(`
  
<div class='content-container'>
  <sb-data-table 
    [data]="_data()" 
    [displayColumns]="_displayColumns()"
    [isLoading]="_loading()" 
    [includeActions]="false"
    [title]="'Album Collection'"
    [emptyMessage]="'No albums found. Try refreshing the data.'"
    [loadingMessage]="'Loading albums...'"
    [itemName]="'album'"
    [iconName]="'album'"
    (refresh)="refresh()"/>
</div>


<sb-notifications-modal-mat
    [errorMsg]="_errorMsg()"
    [successMsg]="_successMsg()" 
    [isLoading]="_loading()" 
    [loadingMessage]="'Loading albums...'"/>
`);
}
