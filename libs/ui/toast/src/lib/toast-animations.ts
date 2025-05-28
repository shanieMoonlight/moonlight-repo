import {
  trigger,
  state,
  transition,
  style,
  animate,
  keyframes,
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

  // Wobble animation - silly shaking entrance with side-to-side wobble
  transition('void => wobble', [
    style({ transform: 'translateX(-100%) rotate(-5deg)', opacity: 0 }),
    animate('{{ enterMs }}ms ease-out', keyframes([
      style({ transform: 'translateX(-100%) rotate(-5deg)', opacity: 0, offset: 0 }),
      style({ transform: 'translateX(0) rotate(0deg)', opacity: 1, offset: 0.3 }),
      style({ transform: 'translateX(-15px) rotate(-2deg)', opacity: 1, offset: 0.5 }),
      style({ transform: 'translateX(15px) rotate(2deg)', opacity: 1, offset: 0.65 }),
      style({ transform: 'translateX(-10px) rotate(-1deg)', opacity: 1, offset: 0.8 }),
      style({ transform: 'translateX(5px) rotate(1deg)', opacity: 1, offset: 0.9 }),
      style({ transform: 'translateX(0) rotate(0deg)', opacity: 1, offset: 1 }),
    ])),
  ], { params: { enterMs: 800 } }),

  transition('wobble => closing', [
    animate('{{ leaveMs }}ms ease-in', keyframes([
      style({ transform: 'translateX(0) rotate(0deg)', opacity: 1, offset: 0 }),
      style({ transform: 'translateX(-10px) rotate(-2deg)', opacity: 1, offset: 0.15 }),
      style({ transform: 'translateX(10px) rotate(2deg)', opacity: 1, offset: 0.3 }),
      style({ transform: 'translateX(-5px) rotate(-1deg)', opacity: 1, offset: 0.45 }),
      style({ transform: 'translateX(5px) rotate(1deg)', opacity: 1, offset: 0.6 }),
      style({ transform: 'translateX(0) rotate(0deg)', opacity: 1, offset: 0.7 }),
      style({ transform: 'translateX(100%) rotate(5deg)', opacity: 0, offset: 1 }),
    ])),
  ], { params: { leaveMs: 600 } }),

  // Spin animation - complete 360 degree spin entrance
  transition('void => spin', [
    style({ transform: 'rotate(360deg) scale(0)', opacity: 0 }),
    animate('{{ enterMs }}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', style({ transform: 'rotate(0deg) scale(1)', opacity: 1 })),
  ], { params: { enterMs: 800 } }),

  transition('spin => closing', [
    animate('{{ leaveMs }}ms ease-in', style({ transform: 'rotate(-180deg) scale(0)', opacity: 0 })),
  ], { params: { leaveMs: 500 } }),

  // Rubber animation - stretchy elastic effect
  transition('void => rubber', [
    style({ transform: 'scaleX(0.1) scaleY(2)', opacity: 0 }),
    animate('{{ enterMs }}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ transform: 'scaleX(1) scaleY(1)', opacity: 1 })),
  ], { params: { enterMs: 700 } }),

  transition('rubber => closing', [
    animate('{{ leaveMs }}ms cubic-bezier(0.6, 0.04, 0.98, 0.335)', style({ transform: 'scaleX(2) scaleY(0.1)', opacity: 0 })),
  ], { params: { leaveMs: 400 } }),
]);

//##################################//

/**
 * Animation type options supported by the toast library
 */
export type ToastAnimationType = 'fade' | 'slide' | 'scale' | 'bounce' | 'wobble' | 'spin' | 'rubber';


/**
 * Toast animation state, which includes all animation types plus the 'closing' state
 */
export type ToastAnimationState = ToastAnimationType | 'closing';

//##################################//