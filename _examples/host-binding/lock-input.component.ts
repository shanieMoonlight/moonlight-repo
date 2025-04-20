import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lock-input',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './lock-input.component.html',
  styleUrl: './lock-input.component.scss',
  host: {
    '[class.disabled]': 'disabled()',
    '[class.isLocked]': 'isLocked()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockInputComponent {
  
  disabled = input(false)
  
  //- - - - - - - - - - - - - - - - - - -//

  protected _isLocked = signal(false);
  protected _icon = computed(() => this._isLocked() ? 'lock' : 'lock_open')
  protected _color = computed(() => this._isLocked() ? 'red' : 'green')

  //-------------------------------------//

  setValue = (): void => 
    this._isLocked.update(lkd => !lkd)
  
}
