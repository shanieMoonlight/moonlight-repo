import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sb-hub-shared-ui-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbHubSharedUiFooterComponent {

  
  protected _currentYear = new Date().getFullYear()
}
