import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MainConstants } from '../../config/constants';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { SbCodeTabsTsHtmlComponentCodeComponent } from '@spider-baby/ui-code-samples';
import { MainDemoHeaderComponent } from '../../ui/demo-header/demo-header.component';
import { DataTableComponent } from '../../ui/table/data-table.component';


///#############################################//

const TS_CODE = `import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';

@Component({
  selector: 'sb-main-demo-simple',
  templateUrl: './simple.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoSimpleComponent {

  private _ioService = inject(DummyAlbumIoService);

  //- - - - - - - - - - - - - //
  
  protected _displayColumns = signal(['id', 'userId', 'title']);
  

  protected _state = MiniStateBuilder
    .Create(() => this._ioService.getAll())
    .trigger();//Trigger immediately

  protected _data = computed(() => this._state.data() ?? []);
  protected _successMsg = this._state.successMsg;
  protected _errorMsg = this._state.errorMsg;
  protected _loading = this._state.loading;

  //- - - - - - - - - - - - - //

  protected refresh = () =>
    this._state.trigger();

}
  
`

///#############################################//

const HTML_CODE = `
  
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


`

///#############################################//

@Component({
  selector: 'sb-main-demo-simple',
  standalone: true,
  imports: [
    MatEverythingModule,
    DataTableComponent,
    SbMatNotificationsModalComponent,
    MainDemoHeaderComponent,
    SbCodeTabsTsHtmlComponentCodeComponent
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

  protected _tsCode = signal(TS_CODE);
  protected _htmlCode = signal(HTML_CODE)
  
}
