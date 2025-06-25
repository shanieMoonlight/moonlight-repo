import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IdTheme } from '../../theme.type';
import { SbToggleIconButtonComponent } from '../toggle-icon-button/toggle-icon-button.component';

@Component({
  selector: 'sb-button-icon-logout-toggle',
  standalone: true,
  imports: [SbToggleIconButtonComponent],
  template: `
  
    <sb-toggle-icon-button
        toggledLabel="Login"
        untoggledLabel="Logout"
        [color]="color()"
        [disabled]="disabled()"
        [colorOnFocus]="colorOnFocus()"
        [toggledTemplate]="logOutTemplate"
        [unToggledTemplate]="logInTemplate"
        (toggled)="onToggled($event)"/>


    <ng-template #logOutTemplate>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
        </svg>
    </ng-template>


    <ng-template #logInTemplate>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/>
        </svg>
    </ng-template>
    
  `,
  styleUrls: ['./button-logout-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbButtonIconLogoutToggleComponent {

  disabled = input<boolean>(false);

  color = input<IdTheme>('primary')
  colorOnFocus = input<boolean>(false);

  loggedIn = output<boolean>();

  onToggled = (toggled: boolean) =>
    this.loggedIn.emit(toggled);


}
