import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sb-oauth',
  imports: [CommonModule],
  templateUrl: './oauth.component.html',
  styleUrl: './oauth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OauthComponent {}
