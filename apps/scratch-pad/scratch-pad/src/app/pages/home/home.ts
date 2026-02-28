import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'scratch-pad-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScratchPadHomePage {}
