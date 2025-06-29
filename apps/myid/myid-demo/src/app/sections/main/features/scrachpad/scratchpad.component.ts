import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, MaintenanceAuthenticatorDemoIoService, UserManagementIoService } from '@spider-baby/myid-io';
import { ConfirmEmailWithPwdFormDto } from '@spider-baby/myid-ui-forms/confirm-email-with-pwd';
import { UpdateTwoFactorProviderFormDto } from '@spider-baby/myid-ui-forms/update-two-factor-provider';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbDataTableComponent } from '@spider-baby/ui-kit/table';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { AppUserDtoFormDto, SbAppUserFormComponent } from '../../../../shared/id/ui/forms/app-user/app-user.component';
import { SbTeamFormComponent } from '../../../../shared/id/ui/forms/team/team.component';
import { demoTeamData, demoTeamDataMinimal, demoTeamDataSuper } from './fake-team-data';
import { superTeam } from './fake-super-data';
import { demoAppUserData, demoAppUserDataMinimal } from './fake-user-data';
import { tableColumns } from './fake-super-data-table-columns';




@Component({
  selector: 'sb-scratchpad',
  imports: [
    GoogleSigninButtonModule,
    MatEverythingModule,
    SbButtonComponent,
    SbMatNotificationsModalComponent,
    SbTeamFormComponent,
    SbAppUserFormComponent,
    SbDataTableComponent

  ],
  standalone: true,
  templateUrl: './scratchpad.component.html',
  styleUrl: './scratchpad.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScratchpadComponent {

  private _ioService = inject(AccountIoService)
  private _ioUserMgmt = inject(UserManagementIoService)
  private _ioMntcAuthTest = inject(MaintenanceAuthenticatorDemoIoService)

  //- - - - - - - - - - - - - //

  _demoTeam = demoTeamData

  protected _authFailTestState = MiniStateBuilder
    .Create(() => this._ioMntcAuthTest.mntc())
    .setSuccessMsgFn((dto, response) => `Message: ${response.message}\nAuthenticator: ${response.authenticator}`)
    .setOnSuccessFn((dto, response) => { console.log('Success:', response); })

    
  protected _superTeamState = MiniStateBuilder
    .Create(() => this._ioUserMgmt.getSuperTeamMembers())
    .trigger()

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._authFailTestState)

  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading


  protected _testUser = demoAppUserData;
  protected _testUserMinimal = demoAppUserDataMinimal;
  protected _testTeam = demoTeamData;
  protected _testTeamSuper = demoTeamDataSuper;
  protected _testTeamMinimal = demoTeamDataMinimal;

  protected _superTeamData = computed(() => superTeam);
  protected _superTeamDataColumns = computed(() => tableColumns);



  //--------------------------//


  handlePasswordSet(dto: ConfirmEmailWithPwdFormDto) {
    console.log('Password set event:', dto)
  }


  handleProviderUpdate(dto: UpdateTwoFactorProviderFormDto) {
    console.log('Updating 2FA provider to:', dto);
  }


  handleAddUser(dto: AppUserDtoFormDto) {
    console.log('Adding User:', dto.teamPosition, dto);
  }


  handleEditUser(dto: AppUserDtoFormDto) {
    console.log('Updating User:', dto.teamPosition, dto);
  }

  authFailTest() {
    console.log('authFailTest');
    this._authFailTestState.trigger()
  }


}//Cls
