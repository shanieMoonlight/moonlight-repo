// Create: apps/myid/myid-demo/src/app/shared/ui/svg-renderer/svg-renderer.component.ts
import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'sb-svg-renderer',
    standalone: true,
    template: `
    <div
        class="sb-svg" 
        [innerHTML]="_sanitizedSvg()" 
        [class]="cssClass()">
    </div>`,
    styles: [`
    :host {
        display: inline-block;
        width: 100%;
        height: 100%;
    }
    .sb-svg{    
        color:inherit;
        width:100%;
        height:100%;
    }
    `]
})
export class SvgRendererComponent {

    private _sanitizer = inject(DomSanitizer)


    svgString = input.required<string>()
    cssClass = input<string>()
    color = input<string>()


    protected _sanitizedSvg = computed(() =>
        this._sanitizer.bypassSecurityTrustHtml(this.svgString())
    )
}