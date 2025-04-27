import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { NotificationsModalComponent } from '../../ui/modals/notifications/notifications.component';
import { DataTableComponent } from '../../ui/table/data-table.component';

@Component({
  selector: 'sb-simple',
  imports: [
    MatEverythingModule,
    DataTableComponent,
    NotificationsModalComponent
  ],
  templateUrl: './simple.component.html',
  styleUrl: './simple.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleComponent {

  private _ioService = inject(DummyAlbumIoService)

  //- - - - - - - - - - - - - //

  protected displayColumns = signal(['id', 'userId', 'title'])

  protected _state = MiniStateBuilder
    .Create(() => this._ioService.getAll())
    .trigger()

  protected _data = computed(() => this._state.data() ?? [])
  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading

  //--------------------------//

  protected refresh = () =>
    this._state.trigger()

}//Cls
