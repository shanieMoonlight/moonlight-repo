import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HubAppSvgs } from '@sb-hub/core-config/images';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  private _iconRegistry = inject(MatIconRegistry);
  private _sanitizer = inject(DomSanitizer);

  //----------------------------//

  constructor() {
    this.registerIcons()
  }

  //----------------------------//

  registerIcons() {
    this._iconRegistry.addSvgIconLiteral('git', this._sanitizer.bypassSecurityTrustHtml(HubAppSvgs.GIT_ICON));
    this._iconRegistry.addSvgIconLiteral('npm', this._sanitizer.bypassSecurityTrustHtml(HubAppSvgs.NPM_ICON));
    console.log('IconsService initialized');
  }


} //Cls
