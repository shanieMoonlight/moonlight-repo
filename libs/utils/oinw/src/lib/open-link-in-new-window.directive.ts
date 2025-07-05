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

@HostListener('mousedown', ['$event'])
onMouseDown(event: MouseEvent) {
  if (event.button !== 0) 
      return; // Only react to left click
    
  if (isPlatformBrowser(this._platformId))
    window.open(this.link());
}
  
} //Cls
