//#############################################//


// Add this enum at the top of your file
export type TransitionStyle = 'overlay' | 'morph';


//#############################################//


/** Interface for Theme Transition specific options */
export interface ThemeTransitionOptions {
  /** Whether to enable theme transitions globally */
  showTransitions?: boolean;
  /** Default transition style ('overlay' or 'morph') */
  style?: TransitionStyle;
  /** Default transition duration in milliseconds */
  duration?: number;
}


//#############################################//


export const DEFAULT_TRANSITION_STYLE: TransitionStyle = 'morph'; // Default transition style
export const DEFAULT_TRANSITION_DURATION = 800
export const DEFAULT_TRANSITION_OPTIONS: ThemeTransitionOptions = {
    showTransitions: false, // Default value
    style: DEFAULT_TRANSITION_STYLE,
    duration: DEFAULT_TRANSITION_DURATION // Default duration
  }


//#############################################//