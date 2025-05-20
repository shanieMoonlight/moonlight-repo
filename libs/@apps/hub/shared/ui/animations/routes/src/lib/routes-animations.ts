import { animate, group, query, sequence, style, transition, trigger } from '@angular/animations';



//####################################################//

// Define a reusable animation
export const fadeSlideUpScaleAnimation =
  trigger('routeAnimations', [
    transition('* <=> *', [ // Apply to any state change
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.98)' })
      ], { optional: true }),
      query(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-20px) scale(0.98)' }))
      ], { optional: true }),
      query(':enter', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ], { optional: true })
    ])
  ]);

//####################################################//
// Was: slideInLeftOutRightAnimation - Renaming to reflect common direction for clarity if needed, or keep as is.
// This was one of the original problematic ones.
// Enter from left, Leave to right
export const slideInLeftOutRightAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ 
      position: 'relative', 
      overflow: 'hidden'
    }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        // Setting a definite height helps ensure content is visible during animation
        height: 'calc(100vh - var(--app-navbar-height, 64px))', 
        // Ensure z-index is below any fixed elements like navbars
        zIndex: 1
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(-100%)', opacity: 0 }) // Enter initial state: from left, transparent
    ], { optional: true }),
    // Using sequence instead of group for more controlled animation flow
    sequence([
      query(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 })) // Leave animates to right
      ], { optional: true }),
      query(':enter', [
        animate('400ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 })) // Enter animates to center
      ], { optional: true })
    ])
  ])
]);

//####################################################//

export const scaleUpAndFadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        transformOrigin: 'center center'
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'scale(0.8)', opacity: 0 })
    ], { optional: true }),
    query(':leave', [
      animate('350ms ease-in', style({ transform: 'scale(1.2)', opacity: 0 }))
    ], { optional: true }),
    query(':enter', [
      animate('350ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
    ], { optional: true })
  ])
]);

//####################################################//

export const fadeThroughColorAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        background: 'var(--mat-app-background-color, white)' // Or a specific color like 'black'
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    query(':leave', [
      animate('250ms ease-in', style({ opacity: 0 }))
    ], { optional: true }),
    query(':enter', [
      animate('250ms ease-out', style({ opacity: 1 }))
    ], { optional: true })
  ])
]);

//####################################################//

export const flipYAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative', perspective: '1000px' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backfaceVisibility: 'hidden' // Important for 3D transforms
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'rotateY(-90deg)', opacity: 0.5 })
    ], { optional: true }),
    query(':leave', [
      animate('400ms ease-in', style({ transform: 'rotateY(90deg)', opacity: 0.5 }))
    ], { optional: true }),
    query(':enter', [
      animate('400ms ease-out', style({ transform: 'rotateY(0deg)', opacity: 1 }))
    ], { optional: true })
  ])
]);

//####################################################//
// Was potentially problematic: explodeAndFadeAnimation
export const explodeAndFadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative', overflow: 'hidden' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%' // Removed height: '100%'
        , transformOrigin: 'center center'
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'scale(0.2)', opacity: 0 }) // Enter: Start smaller
    ], { optional: true }),
    group([
      query(':leave', [
        animate('400ms ease-in', style({ transform: 'scale(1.8)', opacity: 0 })) // Leave: Explode out (slightly less extreme)
      ], { optional: true }),
      query(':enter', [
        animate('400ms ease-out', style({ transform: 'scale(1)', opacity: 1 })) // Enter: Zoom to normal
      ], { optional: true })
    ])
  ])
]);

//####################################################//
// Was: slideOutRightInLeftAnimation
// Leave to right, Enter from left
export const slideOutRightInLeftAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ 
      position: 'relative', 
      overflow: 'hidden'
    }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        // Setting a definite height helps ensure content is visible during animation
        height: 'calc(100vh - var(--app-navbar-height, 64px))', 
        // Ensure z-index is below any fixed elements like navbars
        zIndex: 1
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(-100%)', opacity: 0 })
    ], { optional: true }),
    // Using sequence instead of group for more controlled animation flow
    sequence([
      query(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('400ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);

//####################################################//

// Was: slideOutBottomInTopAnimation
// Leave to bottom, Enter from top
export const slideOutBottomInTopAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ 
      position: 'relative',
      overflow: 'hidden'
    }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        // Setting a definite height helps ensure content is visible during animation
        height: 'calc(100vh - var(--app-navbar-height, 64px))',
        // Ensure z-index is below any fixed elements like navbars
        zIndex: 1
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateY(-30px)', opacity: 0 }) // Reduced distance for smoother entry
    ], { optional: true }),
    // We'll use sequence to ensure leave finishes first for cleaner transition
    sequence([
      query(':leave', [
        animate('300ms ease-out', style({ 
          transform: 'translateY(30px)', 
          opacity: 0 
        }))
      ], { optional: true }),
      query(':enter', [
        animate('300ms ease-out', style({ 
          transform: 'translateY(0)', 
          opacity: 1 
        }))
      ], { optional: true })
    ])
  ])
]);

//####################################################//

export const zoomInZoomOutAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        transformOrigin: 'center center'
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'scale(0.5)', opacity: 0 })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('400ms ease-out', style({ transform: 'scale(0.5)', opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('400ms ease-in', style({ transform: 'scale(1)', opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);

//####################################################//

export const rotateAndFadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative', perspective: '1200px' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backfaceVisibility: 'hidden',
        transformOrigin: 'center center'
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'rotateY(-180deg) scale(0.7)', opacity: 0 })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'rotateY(180deg) scale(0.7)', opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'rotateY(0deg) scale(1)', opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);

//####################################################//
// Was: slideAndBounceAnimation - this one is sequential and should be okay,
// but ensuring no height: '100%' and structure is clean.
export const slideAndBounceAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative', overflow: 'hidden' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%' // Ensured no height: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 }) // Enter initial: from right
    ], { optional: true }),
    query(':leave', [
      animate('300ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 })) // Leave animates to left
    ], { optional: true }),
    query(':enter', [
      animate('600ms cubic-bezier(0.68, -0.55, 0.27, 1.55)', style({ transform: 'translateX(0%)', opacity: 1 })) // Enter animates to center
    ], { optional: true })
  ])
]);

//####################################################//
// Simple Fade In/Out Animation

export const fadeInOutAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    // Use group to run leave and enter animations in parallel
    group([
      query(':leave', [
        animate('1000ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('1000ms ease-out', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);


