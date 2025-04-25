import { isPlatformBrowser } from '@angular/common';
import { Directive, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { ShareService } from './share.service';

@Directive({
  selector: '[sbShareCurrentPage]',
})
export class ShareCurrentPageDirective {

  private _shareService = inject(ShareService)
  private _platformId = inject(PLATFORM_ID)

  //-----------------------------//

  @HostListener('mousedown')
  onMouseDown() {
    if (isPlatformBrowser(this._platformId))
      this._shareService.shareCurrentPage()
  }

}//Cls
