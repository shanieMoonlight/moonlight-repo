
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
  positionVertical?: 'top' | 'bottom' | 'center';
  positionHorizontal?: 'left' | 'right' | 'center';
  // Keep the old position for backward compatibility
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
  public readonly positionVertical: 'top' | 'bottom' | 'center';
  public readonly positionHorizontal: 'left' | 'right' | 'center';
  // Keep the old position for backward compatibility
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
    
    // Handle new positioning system
    this.positionVertical = options.positionVertical ?? 'top';
    this.positionHorizontal = options.positionHorizontal ?? 'right';
    
    // Backward compatibility: map old position to new system
    if (options.position && !options.positionVertical) {
      this.positionVertical = options.position;
    }
    this.position = options.position ?? this.positionVertical;
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

  // Enhanced factory methods with positioning
  static TopLeft = (type: ToastType, text: string, options: ToastOptions = {}): ToastData =>
    new ToastData(type, text, { ...options, positionVertical: 'top', positionHorizontal: 'left' })

  static TopRight = (type: ToastType, text: string, options: ToastOptions = {}): ToastData =>
    new ToastData(type, text, { ...options, positionVertical: 'top', positionHorizontal: 'right' })

  static TopCenter = (type: ToastType, text: string, options: ToastOptions = {}): ToastData =>
    new ToastData(type, text, { ...options, positionVertical: 'top', positionHorizontal: 'center' })

  static BottomLeft = (type: ToastType, text: string, options: ToastOptions = {}): ToastData =>
    new ToastData(type, text, { ...options, positionVertical: 'bottom', positionHorizontal: 'left' })

  static BottomRight = (type: ToastType, text: string, options: ToastOptions = {}): ToastData =>
    new ToastData(type, text, { ...options, positionVertical: 'bottom', positionHorizontal: 'right' })

  static BottomCenter = (type: ToastType, text: string, options: ToastOptions = {}): ToastData =>
    new ToastData(type, text, { ...options, positionVertical: 'bottom', positionHorizontal: 'center' })

  static Center = (type: ToastType, text: string, options: ToastOptions = {}): ToastData =>
    new ToastData(type, text, { ...options, positionVertical: 'center', positionHorizontal: 'center' })


} //Cls
