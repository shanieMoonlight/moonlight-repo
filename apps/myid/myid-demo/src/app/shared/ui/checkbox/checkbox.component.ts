import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { IdTheme } from '../theme.type';

@Component({
  selector: 'sb-checkbox',
  standalone: true,
  imports: [NgClass],
  template: `
    <label class="sb-checkbox-label" [ngClass]="color()">
      <input
        type="checkbox"
        class="sb-checkbox-input"
        [checked]="checked()"
        [disabled]="disabled()"
        (change)="onToggle($event)"/>      
        <div class="sb-checkbox-custom">
          <svg id="icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" fill="currentColor">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
          </svg>
        </div>
        

      <ng-content/>
    </label>

  `,
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbCheckboxComponent {

  checked = input<boolean>(false);
  disabled = input<boolean>(false);
  color = input<IdTheme>('primary');

  checkedChange = output<boolean>();

  onToggle(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checkedChange.emit(input.checked);
  }

}
