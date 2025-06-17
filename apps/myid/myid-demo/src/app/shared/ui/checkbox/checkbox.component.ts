import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

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
      <span class="sb-checkbox-custom"></span>
      <!-- <svg class="sb-checkbox-custom" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg> -->
      <ng-content/>
    </label>

  `,
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbCheckboxComponent {

  checked = input<boolean>(false);
  disabled = input<boolean>(false);
  color = input<'primary' | 'secondary' | 'error'>('primary');

  checkedChange = output<boolean>();

  onToggle(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checkedChange.emit(input.checked);
  }

}
