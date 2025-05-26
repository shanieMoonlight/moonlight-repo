import { animate, style, transition, trigger } from '@angular/animations';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';



@Component({
  selector: 'sb-hub-deferred-loop',
  imports: [NgTemplateOutlet],
  templateUrl: './deferred-grid.component.html',
  styleUrl: './deferred-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeOut', [
      transition(':leave', [
        animate('200ms ease-in-out', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class DeferredGridComponent<T> {

  _data = input<T[]>([], { alias: 'data', });
  _elementTemplate = input.required<TemplateRef<unknown>>({ alias: 'elementTemplate', })

}
