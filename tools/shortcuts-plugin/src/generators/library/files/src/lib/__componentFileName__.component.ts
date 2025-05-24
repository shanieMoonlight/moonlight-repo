import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  standalone: true,
  imports: [
  ],
  providers: [],
  selector: '<%= componentSelector %>',
  templateUrl: './<%= componentFileName %>.component.html',
  styleUrl: './<%= componentFileName %>.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= componentClassName %> {
 

  
  protected _title = 'Spider-Baby ';



} //Cls
