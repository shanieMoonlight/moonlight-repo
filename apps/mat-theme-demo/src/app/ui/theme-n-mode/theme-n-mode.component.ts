import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ml-theme-n-mode',
  imports: [CommonModule],
  templateUrl: './theme-n-mode.component.html',
  styleUrl: './theme-n-mode.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeNModeComponent {}
