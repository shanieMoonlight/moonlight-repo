import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model, TemplateRef } from '@angular/core';
import { SbButtonIconCloseComponent } from '@spider-baby/ui-kit/buttons';


@Component({
    selector: 'sb-ui-modal',
    standalone: true,
    imports: [
        SbButtonIconCloseComponent,
        NgTemplateOutlet
    ],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbModalComponent {

    open = model<boolean>(false);
    template = input.required<TemplateRef<unknown>>();
    templateData = input<unknown>(undefined);
    closeBackdropClick = input<boolean>(true);

    close = () =>
        this.open.set(false);

    onOverlayClick() {
        console.log('Overlay clicked');

        if (this.closeBackdropClick())
            this.open.set(false)
    }
}
