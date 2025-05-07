import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, Input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { Album, IAlbumForm } from '../../../data/album';

@Component({
  selector: 'sb-album-form',
  standalone: true,
  imports: [
    MatEverythingModule,
    ReactiveFormsModule
  ],
  templateUrl: './album-form.component.html',
  styleUrl: './album-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumFormComponent {

  private _fb = inject(FormBuilder)
  private _destroyer = inject(DestroyRef)

  //- - - - - - - - - - - - - //

  protected _album = signal<Album | null | undefined>(null)
  @Input('album')
  public set album(album: Album | null | undefined) {
    console.log('AlbumFormComponent: album', album);

    this._album.set(album)
    if (album)
      this.setFormValues(album)
  }


  //- - - - - - - - - - - - - //

  _editEvent = output<Album>({ alias: 'edit' })
  _addEvent = output<Album>({ alias: 'add' })

  //- - - - - - - - - - - - - //

  protected _isAddForm = computed(() => !this._album())

  //- - - - - - - - - - - - - //

  protected _form: IAlbumForm = this._fb.group({
    id: this._fb.control<string | number | null>(''),
    userId: this._fb.nonNullable.control<string | number>('', [Validators.required]),
    title: this._fb.nonNullable.control<string>('', [Validators.required]),
    description: this._fb.control<string | null>('', [Validators.required]),
  })


  //--------------------------//

  setFormValues(album: Album) {
    if (!album) return;
    this._form.patchValue(album)
  }

  //--------------------------//

  protected edit = (album: Album) =>
    this._editEvent.emit(album)


  protected add = (album: Album) =>
    this._addEvent.emit(album)

  //--------------------------//

}//Cls
