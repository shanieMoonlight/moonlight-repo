import { InjectionToken } from '@angular/core';
import { ToastSetupConstants } from './setup-constants'

//##################################//

export const TOAST_CONFIG_TOKEN = new InjectionToken<ToastConfig>(
  'toast-config',
  {
    factory: () => ToastConfig.Create() //Fallback to defaults
  });

//##################################//

export class ToastConfig {
  /** Background color for error toast - default: '#f44336'*/
  private _colorBgError: string = ToastSetupConstants.ColorBgError;
  public get colorBgError(): string {
    return this._colorBgError;
  }

  private _colorTxtError: string = ToastSetupConstants.ColorText;
  public get colorTxtError(): string {
    return this._colorTxtError = this._colorTxtError ?? ToastSetupConstants.ColorText
  }

  private _colorBgWarn: string = ToastSetupConstants.ColorBgWarn;
  /** Background color for warning toast - default: '#ffcc00' */
  public get colorBgWarn(): string {
    return this._colorBgWarn;
  }

  private _colorTxtWarn: string = ToastSetupConstants.ColorText;
  public get colorTxtWarn(): string {
    return this._colorTxtWarn = this._colorTxtWarn ?? ToastSetupConstants.ColorText
  }

  private _colorBgSuccess: string = ToastSetupConstants.ColorBgSuccess;
  /**  Background color for success toast - default: '#c4ecff' */
  public get colorBgSuccess(): string {
    return this._colorBgSuccess;
  }

  private _colorTxtSuccess: string = ToastSetupConstants.ColorText;
  public get colorTxtSuccess(): string {
    return this._colorTxtSuccess = this._colorTxtSuccess ?? ToastSetupConstants.ColorText
  }

  private _colorBgInfo: string = ToastSetupConstants.ColorBgInfo;
  /*  Background color for information toast - default: '#e2ffa8' */
  public get colorBgInfo(): string {
    return this._colorBgInfo;
  }

  private _colorTxtInfo: string = ToastSetupConstants.ColorText;
  public get colorTxtInfo(): string {
    return this._colorTxtInfo = this._colorTxtInfo ?? ToastSetupConstants.ColorText
  }

  private _colorBgDefault: string = ToastSetupConstants.ColorBgDefault;
  /**  Color for Default Background - default: '#fff' */
  public get colorBgDefault(): string {
    return this._colorBgDefault;
  }

  private _colorText: string = ToastSetupConstants.ColorText;
  /**  Color for Text and Icons - default: '#000' */
  public get colorText(): string {
    return this._colorText;
  }

  private _positionConfig: ToastPositionConfig =
    ToastPositionConfig.Create();
  /** Configuration settings for the toast postion - default new ToastPositionConfig()*/
  public get positionConfig(): ToastPositionConfig {
    return this._positionConfig;
  }

  private _animationConfig: ToastAnimationConfig =
    ToastAnimationConfig.Create();
  /** Configuration settings for the toast animations - default new ToastAnimationConfig()*/
  public get animationConfig(): ToastAnimationConfig {
    return this._animationConfig;
  }

  //----------------------------------//

  /**
   * Set paramater to null to use default values.
   * Enter no paramaters to use default values on everything
   * @param colorBgError Background color for error toast - default: '#f44336'
   * @param colorBgWarn Background color for warning toast - default: '#ffcc00'
   * @param colorBgSuccess Background color for success toast - default: '#c4ecff'
   * @param colorBgInfo Background color for information toast - default: '#e2ffa8'
   * @param colorBgDefault Color for Default Background - default: '#fff'
   * @param colorText Color for Text and Icons - default: '#000'
   * @param positionConfig Configuration settings for the toast postion - default new ToastPositionConfig()
   * @param animationConfig Configuration settings for the toast animations - default new ToastAnimationConfig()
   */
  private constructor(
    colorBgError?: string,
    colorBgWarn?: string,
    colorBgSuccess?: string,
    colorBgInfo?: string,
    colorBgDefault?: string,
    colorText?: string,
    positionConfig?: ToastPositionConfig,
    animationConfig?: ToastAnimationConfig
  ) {
    if (colorBgError) this._colorBgError = colorBgError;

    if (colorBgWarn) this._colorBgWarn = colorBgWarn;

    if (colorBgSuccess) this._colorBgSuccess = colorBgSuccess;

    if (colorBgInfo) this._colorBgInfo = colorBgInfo;

    if (colorBgDefault) this._colorBgDefault = colorBgDefault;

    if (colorText) this._colorText = colorText;

    if (positionConfig) this._positionConfig = positionConfig;

    if (animationConfig) this._animationConfig = animationConfig;
  }

  //------------------------------//

  /**
   * Create new instance of ToastConfig
   */
  static Create(
    colorBgError?: string,
    colorBgWarn?: string,
    colorBgSuccess?: string,
    colorBgInfo?: string,
    colorBgDefault?: string,
    colorText?: string,
    positionConfig?: ToastPositionConfig,
    animationConfig?: ToastAnimationConfig): ToastConfig {
    return new ToastConfig(
      colorBgError,
      colorBgWarn,
      colorBgSuccess,
      colorBgInfo,
      colorBgDefault,
      colorText,
      positionConfig,
      animationConfig,
    );
  }

  //------------------------------//

  /**
   * @param colorBgError Background color for error toast - default: '#f44336'
   * @returns Updated ToastConfig
   */
  setColorBgError(colorBgError: string): ToastConfig {
    this._colorBgError = colorBgError;
    return this;
  }

  //- - - - - - - - - - - - - - - //

  /**
   * @param colorBgWarn Background color for warning toast - default: '#ffcc00'
   * @returns Updated ToastConfig
   */
  setColorBgWarn(colorBgWarn: string): ToastConfig {
    this._colorBgWarn = colorBgWarn;
    return this;
  }

  //- - - - - - - - - - - - - - - //

  /**
   * @param colorBgSuccess Background color for success toast - default: '#c4ecff'
   * @returns Updated ToastConfig
   */
  setColorBgSuccess(colorBgSuccess: string): ToastConfig {
    this._colorBgSuccess = colorBgSuccess;
    return this;
  }

  //- - - - - - - - - - - - - - - //

  /**
   * @param colorBgInfo Background color for information toast - default: '#e2ffa8'
   * @returns Updated ToastConfig
   */
  setColorBgInfo(colorBgInfo: string): ToastConfig {
    this._colorBgInfo = colorBgInfo;
    return this;
  }

  //- - - - - - - - - - - - - - - //

  /**
   * @param colorTxtError Background color for error toast - default: '#f44336'
   * @returns Updated ToastConfig
   */
  setColorTxtError(colorTxtError: string): ToastConfig {
    this._colorTxtError = colorTxtError;
    return this;
  }

  //- - - - - - - - - - - - - - - //

  /**
   * @param colorTxtWarn Background color for warning toast - default: '#ffcc00'
   * @returns Updated ToastConfig
   */
  setColorTxtWarn(colorTxtWarn: string): ToastConfig {
    this._colorTxtWarn = colorTxtWarn;
    return this;
  }

  //- - - - - - - - - - - - - - - //

  /**
   * @param colorTxtSuccess Background color for success toast - default: '#c4ecff'
   * @returns Updated ToastConfig
   */
  setColorTxtSuccess(colorTxtSuccess: string): ToastConfig {
    this._colorTxtSuccess = colorTxtSuccess;
    return this;
  }

  //- - - - - - - - - - - - - - - //

  /**
   * @param colorTxtInfo Background color for information toast - default: '#e2ffa8'
   * @returns Updated ToastConfig
   */
  setColorTxtInfo(colorTxtInfo: string): ToastConfig {
    this._colorTxtInfo = colorTxtInfo;
    return this;
  }

  //- - - - - - - - - - - - - - - //

  /**
   * @param colorBgDefault Color for Default Background - default: '#fff'
   * @returns Updated ToastConfig
   */
  setColorBgDefault(colorBgDefault: string): ToastConfig {
    this._colorBgDefault = colorBgDefault;
    return this;
  }

  //- - - - - - - - - - - - - - - //

  /**
   * @param colorText Color for Text and Icons - default: '#000'
   * @returns Updated ToastConfig
   */
  setColorText(colorText: string): ToastConfig {
    this._colorText = colorText;
    return this;
  }

  //- - - - - - - - - - - - - - - //

  /**
   * @param positionConfig Configuration settings for the toast postion - default new ToastPositionConfig()
   * @returns Updated ToastConfig
   */
  setPositionConfig(positionConfig: ToastPositionConfig): ToastConfig {
    this._positionConfig = positionConfig;
    return this;
  }

  //- - - - - - - - - - - - - - - //

  /**
   * @param animationConfig Configuration settings for the toast animations - default new ToastAnimationConfig()
   * @returns Updated ToastConfig
   */
  setAnimationConfig(animationConfig: ToastAnimationConfig): ToastConfig {
    this._animationConfig = animationConfig;
    return this;
  }

  //------------------------------//


} //Cls

//##################################//

/**
 * Configuration settings for the toast animations
 */
export class ToastAnimationConfig {

  private constructor(public fadeOutMs = 500, public fadeInMs = 350) { }

  /**
   * Create new instance of ToastConfig
   * @param fadeOutMs How long in milliseconds should it take the toast to fade out - default 2500
   * @param fadeInMs How long in milliseconds should it take the toast to fade in - default 350
   */
  static Create(fadeOutMs = 500, fadeInMs = 350): ToastAnimationConfig {
    return new ToastAnimationConfig(fadeOutMs, fadeInMs);
  }

}//Cls 

//##################################//

/**
 * Configuration settings for the toast postion
 */
export class ToastPositionConfig {

  private constructor(
    public topPx = 20, 
    public rightPx = 20, 
    public bottomPx = 20,
    public leftPx = 20
  ) { }

  /**
   * Create new instance of ToastPositionConfig
   * @param topPx How many pixels from the top should the toast be  - default 20
   * @param rightPx How many pixels from the right should the toast be  - default 20
   * @param bottomPx How many pixels from the bottom should the toast be  - default 20
   * @param leftPx How many pixels from the left should the toast be  - default 20
   */
  static Create(topPx = 20, rightPx = 20, bottomPx = 20, leftPx = 20): ToastPositionConfig {
    return new ToastPositionConfig(topPx, rightPx, bottomPx, leftPx);
  }

}//Cls

//##################################//
