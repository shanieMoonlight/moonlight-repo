import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { SbButtonIconCloseComponent, SbTextButtonComponent } from '@spider-baby/ui-kit/buttons';

@Component({
  selector: 'sb-confirm-modal',
  standalone: true,
  imports: [
    SbButtonIconCloseComponent,
    SbTextButtonComponent,
  ],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {

  openModal = model<boolean>(false)

  title = input<string>('Confimation Required')
  description = input.required<string>();


  confirm = output<boolean>()

  //--------------------------//

  protected dismissModal = () =>
    this.openModal.update(() => false)


  protected confirmClick() {
    this.openModal.update(() => false);
    this.confirm.emit(true);
  }
  protected cancelClick() {
    this.openModal.update(() => false);
    this.confirm.emit(false);
  }

}

