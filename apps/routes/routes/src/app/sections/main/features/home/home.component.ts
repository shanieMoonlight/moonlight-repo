import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HighlightModule } from 'ngx-highlightjs';
import { AppConstants } from '../../../../config/constants';
import { AppImages } from '../../../../config/images';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { NavCardComponent } from "../../../../shared/ui/nav-card/nav-card.component";
import { MainRoutes } from '../../config/main-routes-data';
import { MainSectionRoutesDefs } from '../../main-route-defs';
import { ConceptDemoComponent } from '../../ui/concept-demo/concept-demo.component';

//##############################################//

@Component({
  selector: 'rd-main-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatEverythingModule,
    HeroBannerComponent,
    HighlightModule,
    NavCardComponent,
    ConceptDemoComponent,
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHomeComponent {

  protected _title = 'Route Defs Demo';
protected _subtitle = 'Type-safe hierarchical routing for Angular applications';
protected _description = `This demo showcases a robust architecture for managing complex route structures in Angular applications. 
By centralizing route definitions in a type-safe, hierarchical system, we eliminate "magic strings," enable IDE auto-completion, and make refactoring painless. 
The pattern scales elegantly from simple apps to enterprise solutions with deeply nested routes, providing both flexibility and compile-time safety.
The application contains various sections with dummy components for demonstrating the routing system.
Most buttons will have a tooltip with the route path they will navigate to.

To learn how it works checkout the description below or for a more comprehensive overview,
check out the the Tutorial section in the main menu.
`;


  protected _heroImageUrl = AppImages.Logo.default;
  protected _heroImageAlt = 'Route Defs Demo Logo';

  protected _mainRoutes = MainRoutes
  protected _gitUrl = AppConstants.GIT_REP_URL

  //Calling from base main so can use relative path
  protected _aboutRoute =    MainSectionRoutesDefs.routes.route('about')
  protected _contactRoute =  MainSectionRoutesDefs.routes.route('contact')
  protected _productsRoute = MainSectionRoutesDefs.routes.route('products')
  protected _tutorialRoute = MainSectionRoutesDefs.routes.route('tutorial')


}
