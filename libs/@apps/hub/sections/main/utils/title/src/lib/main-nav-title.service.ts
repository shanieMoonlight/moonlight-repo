import { inject, Injectable, signal } from '@angular/core';
import { HubRouterUtilsService } from '@sb-hub/shared-utils/router';
import { HubMainAreaRoutesDefs } from '@sb-hub/sections-main/route-defs';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainNavTitleService {

  private _navService = inject(HubRouterUtilsService)

  title = signal<string>('SpiderBaby Hub')
  private _titleSubscription?: Subscription;

  //-----------------------//

  /**
   * Let someone know that the title has changed
   * @param newTitle new height
   */
  changeTitle = (newTitle?: string) =>
    this.title.set(newTitle ?? 'SpiderBaby Hub')

  //-----------------------//

  /**
   * Converts a string to title case.
   * Example: "hello-world" becomes "Hello World"
   * @param str The string to convert.
   * @returns The title-cased string.
   */
  private toTitleCase(str: string | undefined | null): string | undefined {
    if (!str)
      return undefined; 
    
    return str.replace(/-/g, ' ') // Replace all hyphens with spaces
      .toLowerCase() // Convert to lowercase first
      .split(' ') // Split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(' '); // Join words back
  }

  //-----------------------//
  
  updateOnNavigationChange() {
    
    const mainAreaBaseSegment = HubMainAreaRoutesDefs.BASE; // e.g., 'main'

    this._titleSubscription = this._navService.currentRoute$
    .subscribe(route => {
      const uriSegments = route.split('/');
      const firstUriSegment = uriSegments[0];
      
      let segmentForTitleProcessing: string | undefined = undefined;
      
      if (firstUriSegment === mainAreaBaseSegment) {
        // Route is within the main area
        if (uriSegments.length > 1) // There's something after the base segment (e.g., 'main/home')            
      segmentForTitleProcessing = uriSegments[1];
        
      } else {
        // Route is not within the main area (e.g., 'api/users')
        segmentForTitleProcessing = firstUriSegment;
      }
      
      // Clean the segment: remove query parameters.
      // Hyphen replacement and capitalization are handled by toTitleCase.
      const cleanedSegment = segmentForTitleProcessing?.split("?")[0];
      console.log('Segment used for Title:', cleanedSegment);
      
      const title = this.toTitleCase(cleanedSegment);
      // this.changeTitle(title);
      this.changeTitle('Spider Baby');  //Later, use the title variable , when we have mor pages
    });
  }
  
  //-----------------------//

  unsubscribe =()  => this._titleSubscription?.unsubscribe()


  
}//Cls
