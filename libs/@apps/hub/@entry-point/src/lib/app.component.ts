import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {
  // fadeSlideUpScaleAnimation,
  // slideInLeftOutRightAnimation, 
  // scaleUpAndFadeAnimation,
  // fadeThroughColorAnimation,
  // explodeAndFadeAnimation,
  // flipYAnimation,
  // slideOutRightInLeftAnimation,
  // rotateAndFadeAnimation,
  // slideAndBounceAnimation,
  // zoomInZoomOutAnimation,
  // slideOutBottomInTopAnimation,
  fadeInOutAnimation
} from '@sb-hub/shared-ui/animations/routes';

//####################################################//
@Component({
  imports: [RouterModule],
  selector: 'hub-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [fadeInOutAnimation] 
})
export class AppComponent {
  title = 'Spider Baby Hub';


  prepareRoute(outlet: RouterOutlet) {
    return outlet
      && outlet.activatedRouteData
      && outlet.activatedRouteData['animation'];
  }

}
