import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';

@Component({
  selector: 'sb-loader-modal',
  standalone: true,
  imports: [MatEverythingModule],
  template: `
  @if (isLoading()) {
    <div class="loader-modal-backdrop">
        <mat-spinner diameter="100"/>
    </div>
  }
  `,
  styles: `
    :host {
      display: block;
    }
    
.loader-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

mat-spinnerl {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderModalComponent {

  loadingMessage = input<string>('Loading data...');
  isLoading = input<boolean>(false);

}
