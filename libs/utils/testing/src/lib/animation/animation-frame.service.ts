import { Injectable } from '@angular/core';

/**
 * Wraps browser animation frame APIs to enable easier testing of components
 * and services that depend on requestAnimationFrame.
 * 
 * This service allows you to:
 * - Write code using normal animation frames during production
 * - Mock/spy on animation frame behavior during tests
 * - Avoid direct browser API calls that are difficult to test
 * 
 * @example
 * // In your service/component:
 * constructor(private animationFrame: AnimationFrameService) {}
 * 
 * applyChanges() {
 *   this.animationFrame.request(() => {
 *     // DOM operations here
 *   });
 * }
 * 
 * // In your tests:
 * const mockAnimationFrame = {
 *   request: (cb: FrameRequestCallback) => { cb(0); return 0; }
 * };
 * TestBed.configureTestingModule({
 *   providers: [{ provide: AnimationFrameService, useValue: mockAnimationFrame }]
 * });
 */
@Injectable({
  providedIn: 'root'
})
export class AnimationFrameService {

  /**
   * Requests an animation frame from the browser.
   * 
   * @param callback - Function to execute when the browser is ready to update the animation
   * @returns A request ID that can be used to cancel the callback
   */
  request(callback: FrameRequestCallback): number {
    return requestAnimationFrame(callback);
  }

  //- - - - - - - - - - - - - - -//

  /**
   * Cancels a previously scheduled animation frame request.
   * 
   * @param handle - The ID value returned by the request method
   */
  cancel(handle: number): void {
    cancelAnimationFrame(handle);
  }

}
//Cls