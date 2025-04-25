import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-sb-notifications',
  imports: [CommonModule],
  templateUrl: './sb-notifications.component.html',
  styleUrl: './sb-notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbNotificationsComponent {}
