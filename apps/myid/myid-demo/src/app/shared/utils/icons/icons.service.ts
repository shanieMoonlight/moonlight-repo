import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppSvgs } from '../../../config/svgs';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIconLiteral('git', sanitizer.bypassSecurityTrustHtml(AppSvgs.GIT_ICON));
    iconRegistry.addSvgIconLiteral('npm', sanitizer.bypassSecurityTrustHtml(AppSvgs.NPM_ICON));
    iconRegistry.addSvgIconLiteral('swagger', sanitizer.bypassSecurityTrustHtml(AppSvgs.SWAGGER_ICON));
    iconRegistry.addSvgIconLiteral('hangfire', sanitizer.bypassSecurityTrustHtml(AppSvgs.HANGFIRE_ICON));
  }

}//Cls
