import {
  trigger,
  state,
  transition,
  style,
  animate,
} from '@angular/animations';

//##################################//

/**
 * Dynamic animation trigger that handles all toast animation types
 */
export const dynamicToastAnimation = trigger('dynamicToastAnimation', [
  state('default', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
  
  // Fade animation
  transition('void => fade', [
    style({ opacity: 0 }),
    animate('{{ enterMs }}ms'),
  ], { params: { enterMs: 300 } }),
  
  transition('fade => closing', [
    animate('{{ leaveMs }}ms', style({ opacity: 0 })),
  ], { params: { leaveMs: 200 } }),
  
  // Slide animation
  transition('void => slide', [
    style({ transform: 'translateY(-100%)', opacity: 0 }),
    animate('{{ enterMs }}ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
  ], { params: { enterMs: 300 } }),
  
  transition('slide => closing', [
    animate('{{ leaveMs }}ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 })),
  ], { params: { leaveMs: 200 } }),
  
  // Scale animation
  transition('void => scale', [
    style({ transform: 'scale(0.3)', opacity: 0 }),
    animate('{{ enterMs }}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ transform: 'scale(1)', opacity: 1 })),
  ], { params: { enterMs: 300 } }),
  
  transition('scale => closing', [
    animate('{{ leaveMs }}ms ease-in', style({ transform: 'scale(0.3)', opacity: 0 })),
  ], { params: { leaveMs: 200 } }),
  
  // Bounce animation
  transition('void => bounce', [
    style({ transform: 'translateY(-100%)', opacity: 0 }),
    animate('{{ enterMs }}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({ transform: 'translateY(0)', opacity: 1 })),
  ], { params: { enterMs: 400 } }),
  
  transition('bounce => closing', [
    animate('{{ leaveMs }}ms cubic-bezier(0.6, -0.28, 0.735, 0.045)', style({ transform: 'translateY(-100%)', opacity: 0 })),
  ], { params: { leaveMs: 300 } }),
]);

//##################################//

/**
 * Animation type options supported by the toast library
 */
export type ToastAnimationType = 'fade' | 'slide' | 'scale' | 'bounce';


/**
 * Toast animation state, which includes all animation types plus the 'closing' state
 */
export type ToastAnimationState = ToastAnimationType | 'closing';

//##################################//