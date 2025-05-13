import { inject, Injectable, signal } from '@angular/core';
import { HubRouterUtilsService } from '../../../../shared/utils/routing/hub-navigation.service';

@Injectable({
  providedIn: 'root',
})
export class MainNavTitleService {

  private _navService = inject(HubRouterUtilsService)

  value = signal<string>('SpiderBaby Hub')

  //-----------------------//

  /**
   * Let someone know that the title has changed
   * @param newTitle new height
   */
  changeTitle = (newTitle?: string) =>
    this.value.set(newTitle ?? 'SpiderBaby Hub')

  //-----------------------//

  /**
   * Converts a string to title case.
   * Example: "hello-world" becomes "Hello World"
   * @param str The string to convert.
   * @returns The title-cased string.
   */
  private toTitleCase(str: string | undefined | null): string | undefined {
    return str?.replace(/-/g, ' ') // Replace all hyphens with spaces
      .toLowerCase() // Convert to lowercase first
      .split(' ') // Split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(' '); // Join words back
  }

  //-----------------------//

  updateOnNavigationChange() {

    this._navService.currentRoute$
      .subscribe(route => {
        const firstSegment = route.split('/')?.[0]
        const titleSegment = firstSegment?.replace('-', ' ')?.split("?")[0]?.toUpperCase()
        const title = this.toTitleCase(titleSegment);
        this.changeTitle(title)
      })
  }

}//Cls
