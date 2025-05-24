import { isPlatformBrowser } from '@angular/common';
import { Directive, HostListener, PLATFORM_ID, inject, input } from '@angular/core';

@Directive({
  selector: '[sbNavigateNewWindow]',
  standalone: true
})
export class SbNavigateNewWindowDirective {

  private _platformId = inject(PLATFORM_ID)

  //- - - - - - - - - - - - - - - - - - -//

  link = input( '#', {alias:'sbNavigateNewWindow',transform: (val?:string) => val ?? '#'})

  //- - - - - - - - - - - - - - - - - - -//

  @HostListener('mousedown')
  onMouseDown() {
    if (isPlatformBrowser(this._platformId))
      window.open(this.link())
  }
  
} //Cls
