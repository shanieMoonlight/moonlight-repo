import {
  AnimationTriggerMetadata,
  trigger,
  state,
  transition,
  style,
  animate,
} from '@angular/animations';

//##################################//

export const toastAnimations: { 
  readonly fadeToast: AnimationTriggerMetadata;
  readonly slideToast: AnimationTriggerMetadata;
  readonly scaleToast: AnimationTriggerMetadata;
  readonly bounceToast: AnimationTriggerMetadata;
} = {
    fadeToast: trigger('fadeAnimation', [
      state('default', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('{{ enterMs }}ms'),
      ], { params: { enterMs: 300 } }),
      transition(
        '* => closing',
        animate('{{ leaveMs }}ms', style({ opacity: 0 })),
        { params: { leaveMs: 200 } }
      ),
    ]),

    slideToast: trigger('slideAnimation', [
      state('default', style({ transform: 'translateY(0)', opacity: 0 })),
      transition('void => *', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('{{ enterMs }}ms ease-out'),
      ], { params: { enterMs: 300 } }),
      transition(
        '* => closing',
        animate('{{ leaveMs }}ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 })),
        { params: { leaveMs: 200 } }
      ),
    ]),

    scaleToast: trigger('scaleAnimation', [
      state('default', style({ transform: 'scale(0)', opacity: 0 })),
      transition('void => *', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('{{ enterMs }}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'),
      ], { params: { enterMs: 300 } }),
      transition(
        '* => closing',
        animate('{{ leaveMs }}ms ease-in', style({ transform: 'scale(0.3)', opacity: 0 })),
        { params: { leaveMs: 200 } }
      ),
    ]),

    bounceToast: trigger('bounceAnimation', [
      state('default', style({ transform: 'translateY(0)', opacity: 0 })),
      transition('void => *', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('{{ enterMs }}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'),
      ], { params: { enterMs: 400 } }),
      transition(
        '* => closing',
        animate('{{ leaveMs }}ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 })),
        { params: { leaveMs: 200 } }
      ),
    ]),
  };

//--------------------------------------------------------------------------------------//

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

//--------------------------------------------------------------------------------------//


export type ToastAnimationType = 'fade' | 'slide' | 'scale' | 'bounce';
export type ToastAnimationState = ToastAnimationType | 'closing';

//--------------------------------------------------------------------------------------//

/**
 * Get the animation trigger for a specific animation type
 */
export function getToastAnimation(type: ToastAnimationType): AnimationTriggerMetadata {
  switch (type) {
    case 'fade':
      return toastAnimations.fadeToast;
    case 'slide':
      return toastAnimations.slideToast;
    case 'scale':
      return toastAnimations.scaleToast;
    case 'bounce':
      return toastAnimations.bounceToast;
    default:
      return toastAnimations.fadeToast;
  }
}

/**
 * Get the animation state name for a specific animation type
 */
export function getAnimationStateName(type: ToastAnimationType): string {
  switch (type) {
    case 'fade':
      return 'fadeAnimation';
    case 'slide':
      return 'slideAnimation';
    case 'scale':
      return 'scaleAnimation';
    case 'bounce':
      return 'bounceAnimation';
    default:
      return 'fadeAnimation';
  }
}
