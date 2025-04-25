import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'sb-home-section-hdr',
  imports: [],
  template: `
  <h2 class="numbered-heading">
      <span class="section-number">{{_sectionNumber()}}</span>
      {{_title()}}
  </h2>
  `,
  styles: `
    :host {
      display: block;
    }    
  .numbered-heading {
    display: flex;
    align-items: center;

    .section-number {
      font-size: 1.5rem;
      opacity: 0.5;
      margin-right: 1rem;
      font-weight: 600;
      color: var(--mat-sys-primary);
    }
}

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HomeSectionHdrComponent {


  _sectionNumber = input.required({ alias: 'sectionNumber' });
  _title = input.required({ alias: 'title' });

}
