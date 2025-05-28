
//##################################//

export type ToastType = 'warn' | 'info' | 'success' | 'error';

//##################################//

export interface ToastAction {
  label: string;
  action: () => void;
  color?: 'primary' | 'accent' | 'warn';
}

//##################################//

export interface ToastOptions {
  duration?: number;
  dismissible?: boolean;
  actions?: ToastAction[];
  position?: 'top' | 'bottom' | 'center';
  showIcon?: boolean;
  customIcon?: string;
  customClass?: string;
}

//##################################//

export class ToastData {

  public readonly actions?: ToastAction[];
  public readonly dismissible: boolean;
  public readonly showIcon: boolean;
  public readonly customIcon?: string;
  public readonly customClass?: string;
  public readonly position: 'top' | 'bottom' | 'center';

  

  constructor(
    public type: ToastType,
    public text?: string,
    options: ToastOptions = {}
  ) {
    this.actions = options.actions;
    this.dismissible = options.dismissible ?? true;
    this.showIcon = options.showIcon ?? true;
    this.customIcon = options.customIcon;
    this.customClass = options.customClass;
    this.position = options.position ?? 'top';
  }

  //----------------------------//

  static Create = (type: ToastType, text: string, options: ToastOptions = {}): ToastData => 
    new ToastData(type, text, options)


  static Success = (text: string, options: ToastOptions = {}): ToastData =>
    new ToastData('success', text, options)


  static Error = (text: string, options: ToastOptions = {}): ToastData =>
    new ToastData('error', text, options)


  static Warning = (text: string, options: ToastOptions = {}): ToastData =>
    new ToastData('warn', text, options)


  static Info = (text: string, options: ToastOptions = {}): ToastData =>
    new ToastData('info', text, options)


} //Cls
