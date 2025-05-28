
import { ToastAnimationType } from './toast-animations';

//##################################//

export type ToastType = 'warn' | 'info' | 'success' | 'error';

//##################################//

export interface ToastOptions {
  duration?: number;
  dismissible?: boolean;
  positionVertical?: 'top' | 'bottom' | 'center';
  positionHorizontal?: 'left' | 'right' | 'center';
  showIcon?: boolean;
  animationType?: ToastAnimationType;
}

//##################################//

export class ToastData {

  public  dismissible: boolean
  public  showIcon: boolean
  public  positionVertical: 'top' | 'bottom' | 'center';
  public  positionHorizontal: 'left' | 'right' | 'center';
  public animationType: ToastAnimationType;

  constructor(
    public type: ToastType,
    public text?: string,
    options: ToastOptions = {}
  ) {
    
    this.dismissible = options.dismissible ?? true;
    this.showIcon = options.showIcon ?? true;
    this.animationType = options.animationType ?? 'fade';
    
    // Handle new positioning system
    this.positionVertical = options.positionVertical ?? 'top';
    this.positionHorizontal = options.positionHorizontal ?? 'right';
    
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

  
  //- - - - - - - - - - - - - - - //

  // Positioning instance methods
  positionTopLeft(): ToastData {
    this.positionVertical = 'top';
    this.positionHorizontal = 'left';
    return this;
  }

  positionTopRight(): ToastData {
    this.positionVertical = 'top';
    this.positionHorizontal = 'right';
    return this;
  }

  positionTopCenter(): ToastData {
    this.positionVertical = 'top';
    this.positionHorizontal = 'center';
    return this;
  }

  positionBottomLeft(): ToastData {
    this.positionVertical = 'bottom';
    this.positionHorizontal = 'left';
    return this;
  }

  positionBottomRight(): ToastData {
    this.positionVertical = 'bottom';
    this.positionHorizontal = 'right';
    return this;
  }

  positionBottomCenter(): ToastData {
    this.positionVertical = 'bottom';
    this.positionHorizontal = 'center';
    return this;
  }

  positionCenter(): ToastData {
    this.positionVertical = 'center';
    this.positionHorizontal = 'center';
    return this;
  }

  //- - - - - - - - - - - - - - - //

  // Animation-specific instance methods
  withFade(): ToastData {
    this.animationType = 'fade';
    return this;
  }

  withSlide(): ToastData {
    this.animationType = 'slide';
    return this;
  }

  withScale(): ToastData {
    this.animationType = 'scale';
    return this;
  }

  withBounce(): ToastData {
    this.animationType = 'bounce';
    return this;
  }


} //Cls
