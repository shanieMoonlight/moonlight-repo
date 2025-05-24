import { ChangeDetectionStrategy, Component, input, output, } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';

@Component({
  selector: 'sb-hub-blog-ui-btn-download',
  imports: [MatEverythingModule],
  templateUrl: './btn-download.component.html',
  styleUrl: './btn-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubUiBtnDownloadComponent {

  _showButton = input<boolean>(false, { alias: 'showButton' });
  _loading = input<boolean>(false, { alias: 'loading' });
  _tooltip = input<string>('', { alias: 'tooltip' });

  _downloadClick = output<void>({ alias: 'downloadClick' });

  downloadClick() {
    this._downloadClick.emit();
  }
  
}
