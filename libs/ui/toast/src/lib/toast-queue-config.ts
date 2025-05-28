export interface ToastQueueConfig {
  /**
   * Maximum number of toasts to show simultaneously
   * @default 5
   */
  maxVisible: number;
  
  /**
   * Whether to queue new toasts when max is reached
   * @default true
   */
  enableQueue: boolean;
  
  /**
   * Strategy for handling queue overflow
   * - 'dismiss-oldest': Remove oldest toast to make room
   * - 'dismiss-newest': Reject new toast
   * - 'dismiss-all': Clear all and show new
   * @default 'dismiss-oldest'
   */
  overflowStrategy: 'dismiss-oldest' | 'dismiss-newest' | 'dismiss-all';
  
  /**
   * Spacing between stacked toasts in pixels
   * @default 8
   */
  stackSpacing: number;
}

//##################################//

export const DEFAULT_QUEUE_CONFIG: ToastQueueConfig = {
  maxVisible: 5,
  enableQueue: true,
  overflowStrategy: 'dismiss-oldest',
  stackSpacing: 8
};

//##################################//