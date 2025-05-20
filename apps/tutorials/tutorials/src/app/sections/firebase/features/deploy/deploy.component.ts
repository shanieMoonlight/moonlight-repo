import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sb-firebase-deploy',
  imports: [CommonModule],
  templateUrl: './deploy.component.html',
  styleUrl: './deploy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirebaseDeployComponent {}
