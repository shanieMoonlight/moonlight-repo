import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { filter, map } from 'rxjs';
import { Album, AlbumUtils } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { AlbumFormComponent } from '../../ui/album/form/album-form.component';
import { SbCodeTabsTsHtmlComponentCodeComponent } from '@spider-baby/ui-code-samples';
import { MainDemoHeaderComponent } from "../../ui/demo-header/demo-header.component";


///#############################################//

const TS_CODE = `
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { filter, map } from 'rxjs';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { AlbumFormComponent } from '../../ui/album/form/album-form.component';

@Component({
  selector: 'sb-main-demo-detail',
  imports: [
    MatEverythingModule,
    SbMatNotificationsModalComponent,
    ReactiveFormsModule,
    AlbumFormComponent
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoDetailComponent {

  private _ioService = inject(DummyAlbumIoService)
  private _actRoute = inject(ActivatedRoute)
  private _router = inject(Router)

  //- - - - - - - - - - - - - //

  private _id$ = this._actRoute.paramMap.pipe(
    map((params: ParamMap) => params.get('id') ?? undefined),
    filter((id: string | undefined): id is string => !!id)
  )

  //Everytime _id$ changes, the _itemState will be triggered
  private _itemState = MiniStateBuilder.CreateWithObservableInput(
    this._id$,
    (id: string) => this._ioService.getById(id))

  private _editState = MiniStateBuilder
    .CreateWithInput((album: Album) => this._ioService.update(album))
    .setSuccessMsgFn((album: Album) => \`Album \${album.title} updated successfully!\`)

  private _state = MiniStateCombined.Combine(
    this._itemState,
    this._editState)

  protected _album = computed(() => this._state.data() ?? [])
  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading

  //- - - - - - - - - - - - - //

  protected edit = (album: Album) =>
    this._editState.trigger(album)


  protected refresh = () =>
    this._itemState.retrigger() // <-- This will re-trigger the _itemState with the last observable input's value and fetch the data again
                                // Which may be differnt in this case because the data is randomized in the DummyAlbumIoService

  //- - - - - - - - - - - - - //

  protected randomize() {
    const randomId = Math.floor(Math.random() * 100) + 1;
    this._router.navigate(['../', randomId], { relativeTo: this._actRoute });
  }
        
}`

///#############################################//

const HTML_CODE = `        
     
<div class="content-container">
  <h2>Album Detail</h2>
  <button mat-raised-button color="primary" (click)="refresh()">
    <mat-icon>refresh</mat-icon> Refresh Data
  </button>
  <button mat-raised-button color="primary" 
    (click)="randomize()"
    [matTooltip]="'Update Route param with random id to trigger MiniState input Observable'">
    <mat-icon>refresh</mat-icon> Random Data
  </button>

   <sb-album-form
      [album]="_album()"
      (edit)="edit($event)" />
</div>



<sb-notifications-modal-mat
    [errorMsg]="_errorMsg()"
    [successMsg]="_successMsg()" 
    [isLoading]="_loading()" 
    [loadingMessage]="'Loading albums...'"/>
        `

///#############################################//


@Component({
  selector: 'sb-main-demo-detail',
  standalone: true,
  imports: [
    MatEverythingModule,
    SbMatNotificationsModalComponent,
    ReactiveFormsModule,
    AlbumFormComponent,
    SbCodeTabsTsHtmlComponentCodeComponent,
    MainDemoHeaderComponent
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoDetailComponent {

  private _ioService = inject(DummyAlbumIoService)
  private _actRoute = inject(ActivatedRoute)
  private _router = inject(Router)

  //- - - - - - - - - - - - - //

  //Get the 'id' param from the route as an Observable
  private _id$ = this._actRoute.paramMap.pipe(
    map((params: ParamMap) => params.get('id') ?? undefined),
    filter((id: string | undefined): id is string => !!id)
  )

  //- - - - - - - - - - - - - //  

  private _itemState = MiniStateBuilder.CreateWithObservableInput(
    this._id$,
    (id: string) => this._ioService.getById(id)
  )

  

  protected edit = (album: Album) =>
    this._editState.trigger({ ...album, title: `${album.title} (Updated)!!` })
  
  private _editState = MiniStateBuilder
    .CreateWithInput((album: Album) => this._ioService.update(album))
    .setSuccessMsgFn((album: Album) => `Album ${album.title} updated successfully!`)



  private _state = MiniStateCombined.Combine(
    this._itemState,
    this._editState)

  protected _album = computed(() => this._state.data() ?? [])
  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading

  //--------------------------//

  protected refresh = () =>
    this._itemState.retrigger()


  protected randomize() {
    const randomId = Math.floor(Math.random() * 100) + 1;
    this._router.navigate(['../', randomId], { relativeTo: this._actRoute });
  }

  //--------------------------//

  protected _tsCode = signal(TS_CODE);

  protected _htmlCode = signal(HTML_CODE);

}//Cls
