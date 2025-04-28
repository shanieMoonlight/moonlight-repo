import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { filter, map } from 'rxjs';
import { Album, IAlbumForm } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { AlbumFormComponent } from '../../ui/album/form/album-form.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'sb-simple',
  imports: [
    MatEverythingModule,
    SbMatNotificationsModalComponent,
    ReactiveFormsModule,
    AlbumFormComponent,
    JsonPipe
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent {

  private _ioService = inject(DummyAlbumIoService)
  private _actRoute = inject(ActivatedRoute)
  private _router = inject(Router)
  private _fb = inject(FormBuilder)
  private _destroyer = inject(DestroyRef)

  //- - - - - - - - - - - - - //


  private _id$ = this._actRoute.paramMap
    .pipe(
      map((params: ParamMap) => params.get('id') ?? undefined),
      filter((id: string | undefined): id is string => !!id)
    )

  //- - - - - - - - - - - - - //  

  private _itemState = MiniStateBuilder.CreateWithObservableInput(
    this._id$,
    (id: string) => this._ioService.getById(id),
    this._destroyer)

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

  protected edit = (album: Album) =>
    this._editState.trigger(album)


  protected refresh = () =>
    this._itemState.retrigger()


  protected randomize(){    
    const randomId = Math.floor(Math.random() * 100) + 1; 
    this._router.navigate(['../', randomId], { relativeTo: this._actRoute });
  }

  //--------------------------//

}//Cls
