import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


//####################################################//
@Component({
  imports: [RouterModule],
  selector: 'hub-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Spider Baby Hub';


}
