import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, MaintenanceAuthenticatorDemoIoService, UserManagementIoService } from '@spider-baby/myid-io';
import { AppUserDto } from '@spider-baby/myid-io/models';
import { ConfirmEmailWithPwdFormDto } from '@spider-baby/myid-ui-forms/confirm-email-with-pwd';
import { UpdateTwoFactorProviderFormDto } from '@spider-baby/myid-ui-forms/update-two-factor-provider';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbDataTableComponent, SbDataTableRowData } from '@spider-baby/ui-kit/table';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { AddMntcMemberFormDto, SbAddMntcMemberFormComponent } from '../../../../shared/id/ui/forms/add-mntc-member/add-mntc-member-form.component';
import { AppUserDtoFormDto, SbAppUserFormComponent } from '../../../../shared/id/ui/forms/app-user/app-user.component';
import { SbRegisterCustomerFormComponent } from '../../../../shared/id/ui/forms/reg-customer/reg-customer-form.component';
import { SbTeamFormComponent } from '../../../../shared/id/ui/forms/team/team.component';
import { SbModalComponent } from '../../../../shared/ui/modal/modal.component';
import { superTeam } from './fake-super-data';
import { tableColumns } from './fake-super-data-table-columns';
import { demoTeamData, demoTeamDataMinimal, demoTeamDataSuper } from './fake-team-data';
import { demoAppUserData, demoAppUserDataMinimal } from './fake-user-data';
import { SbUpdateTeamPositionFormComponent, UpdateTeamPositionFormDto } from '@spider-baby/myid-ui-forms/update-team-position';
// import { teamPositionOptions } from '../../../../shared/auth/user-mgr-admin/utils/posiition/team-position-options';
import { SbSelectComponent } from '@spider-baby/ui-kit/select';
import { MyIdTwoFactorOptionsProvider } from '../../../../shared/id/utils/options/mfa/two-factor-options-provider';
import { MyIdTeamPositionOptionsProvider } from '../../../../shared/id/utils/options/team-position/team-position-options-provider';




@Component({
  selector: 'sb-scratchpad',
  imports: [
    GoogleSigninButtonModule,
    MatEverythingModule,
    SbButtonComponent,
    SbMatNotificationsModalComponent,
    SbTeamFormComponent,
    SbAppUserFormComponent,
    SbDataTableComponent,
    SbAddMntcMemberFormComponent,
    SbModalComponent,
    SbRegisterCustomerFormComponent,
    SbUpdateTeamPositionFormComponent,
    SbUpdateTeamPositionFormComponent,
    SbSelectComponent,

  ],
  standalone: true,
  templateUrl: './scratchpad.component.html',
  styleUrl: './scratchpad.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScratchpadComponent {


  private _ioService = inject(AccountIoService)
  private _ioUserMgmt = inject(UserManagementIoService)
  private _ioMntcAuthTest = inject(MaintenanceAuthenticatorDemoIoService)
  private _twoFactorOptionsProvider = inject(MyIdTwoFactorOptionsProvider)
  private _teamPositionProvider = inject(MyIdTeamPositionOptionsProvider)

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
  
  protected _teamPositionOptions = this._teamPositionProvider.getOptions()
  protected _twoFactorProviderOptions = this._twoFactorOptionsProvider.getOptions();


  // protected _addMemberRef: ComponentRef<SbAddMntcMemberFormComponent>;
  protected _showAddForm = signal(false)



  //--------------------------//

  updatePositionTest($event: UpdateTeamPositionFormDto) {
    console.log('SuperTeamComponent: updatePositionTest called with:', $event)
  }


  handleRowClick(rowData: SbDataTableRowData<AppUserDto>) {
    console.log('Row clicked:', rowData);

  }
  handleAddItem() {
    console.log('handleAddItem');
    this._showAddForm.set(true);
  }


  addMntcMember(dto: AddMntcMemberFormDto) {
    console.log('addMntcMember', dto);
    this._showAddForm.set(false);
  }


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
