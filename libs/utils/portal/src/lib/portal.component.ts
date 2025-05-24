import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  providers: [],
  selector: 'sb-portal',
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbPortalComponent {
  protected _title = 'Spider-Baby ';
} //Cls
