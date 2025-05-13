import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HubAppSvgs } from '@sb-hub/core-config/images';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIconLiteral(
      'git',
      sanitizer.bypassSecurityTrustHtml(HubAppSvgs.GIT_ICON)
    );
    iconRegistry.addSvgIconLiteral(
      'npm',
      sanitizer.bypassSecurityTrustHtml(HubAppSvgs.NPM_ICON)
    );
  }
} //Cls
