import { TemplateRef } from '@angular/core';
import { ToastConstants } from './toast-constants';
import { ToastConfig } from '@spider-baby/ui-toast/setup';

//===================================================================//

export type ToastType = 'warn' | 'info' | 'success' | 'error';

//===================================================================//

export class ToastData {

  constructor(
    public type: ToastType,
    public text?: string,
    public template?: TemplateRef<unknown>,
    public templateContext?: unknown
  ) { }

  //----------------------------//

  static Create(type: ToastType,
    text?: string,
    template?: TemplateRef<unknown>,
    templateContext?: unknown) {
    return new ToastData(type, text, template, templateContext);
  }

  //----------------------------//

} //Cls
