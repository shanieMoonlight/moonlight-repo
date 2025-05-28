
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

  /**
   * Creates a new toast with the specified type, text, and options
   * @param type The type of toast ('warn', 'info', 'success', 'error')
   * @param text The message to display in the toast
   * @param options Additional configuration options
   * @returns A new ToastData instance
   */
  static Create = (type: ToastType, text: string, options: ToastOptions = {}): ToastData => 
    new ToastData(type, text, options)

  /**
   * Creates a success toast with the specified text and options
   * @param text The message to display in the toast
   * @param options Additional configuration options
   * @returns A new ToastData instance with type 'success'
   */
  static Success = (text: string, options: ToastOptions = {}): ToastData =>
    new ToastData('success', text, options)

  /**
   * Creates an error toast with the specified text and options
   * @param text The message to display in the toast
   * @param options Additional configuration options
   * @returns A new ToastData instance with type 'error'
   */
  static Error = (text: string, options: ToastOptions = {}): ToastData =>
    new ToastData('error', text, options)

  /**
   * Creates a warning toast with the specified text and options
   * @param text The message to display in the toast
   * @param options Additional configuration options
   * @returns A new ToastData instance with type 'warn'
   */
  static Warning = (text: string, options: ToastOptions = {}): ToastData =>
    new ToastData('warn', text, options)

  /**
   * Creates an info toast with the specified text and options
   * @param text The message to display in the toast
   * @param options Additional configuration options
   * @returns A new ToastData instance with type 'info'
   */
  static Info = (text: string, options: ToastOptions = {}): ToastData =>
    new ToastData('info', text, options)

  
  //- - - - - - - - - - - - - - - //

  // Positioning instance methods
  /**
   * Positions the toast at the top-left corner of the screen
   * @returns The current ToastData instance for chaining
   */
  positionTopLeft(): ToastData {
    this.positionVertical = 'top';
    this.positionHorizontal = 'left';
    return this;
  }

  /**
   * Positions the toast at the top-right corner of the screen
   * @returns The current ToastData instance for chaining
   */
  positionTopRight(): ToastData {
    this.positionVertical = 'top';
    this.positionHorizontal = 'right';
    return this;
  }

  /**
   * Positions the toast at the top-center of the screen
   * @returns The current ToastData instance for chaining
   */
  positionTopCenter(): ToastData {
    this.positionVertical = 'top';
    this.positionHorizontal = 'center';
    return this;
  }

  /**
   * Positions the toast at the bottom-left corner of the screen
   * @returns The current ToastData instance for chaining
   */
  positionBottomLeft(): ToastData {
    this.positionVertical = 'bottom';
    this.positionHorizontal = 'left';
    return this;
  }

  /**
   * Positions the toast at the bottom-right corner of the screen
   * @returns The current ToastData instance for chaining
   */
  positionBottomRight(): ToastData {
    this.positionVertical = 'bottom';
    this.positionHorizontal = 'right';
    return this;
  }

  /**
   * Positions the toast at the bottom-center of the screen
   * @returns The current ToastData instance for chaining
   */
  positionBottomCenter(): ToastData {
    this.positionVertical = 'bottom';
    this.positionHorizontal = 'center';
    return this;
  }

  /**
   * Positions the toast at the center of the screen
   * @returns The current ToastData instance for chaining
   */
  positionCenter(): ToastData {
    this.positionVertical = 'center';
    this.positionHorizontal = 'center';
    return this;
  }

  //- - - - - - - - - - - - - - - //

  // Animation-specific instance methods
  /**
   * Sets the toast animation type to fade
   * @returns The current ToastData instance for chaining
   */
  withFade(): ToastData {
    this.animationType = 'fade';
    return this;
  }

  /**
   * Sets the toast animation type to slide
   * @returns The current ToastData instance for chaining
   */
  withSlide(): ToastData {
    this.animationType = 'slide';
    return this;
  }

  /**
   * Sets the toast animation type to scale
   * @returns The current ToastData instance for chaining
   */
  withScale(): ToastData {
    this.animationType = 'scale';
    return this;
  }

  /**
   * Sets the toast animation type to bounce
   * @returns The current ToastData instance for chaining
   */
  withBounce(): ToastData {
    this.animationType = 'bounce';
    return this;
  }


} //Cls
