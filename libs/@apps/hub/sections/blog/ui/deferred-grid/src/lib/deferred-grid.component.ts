import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';



@Component({
  selector: 'sb-hub-ui-deferred-grid',
  imports: [NgTemplateOutlet],
  templateUrl: './deferred-grid.component.html',
  styleUrl: './deferred-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SbHubDeferredGridComponent<T> {

  _data = input<T[]>([], { alias: 'data', });
  _elementTemplate = input.required<TemplateRef<unknown>>({ alias: 'elementTemplate', })
  _staggerDelayMs = input<number>(100, { alias: 'staggerDelay' });

}
