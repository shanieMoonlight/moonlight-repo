const CONTROLLER = 'UserManagement';

type ACTIONS =
  | 'deleteCustomer'
  | 'getCustomers'
  | 'getCustomersPage'
  | 'getCustomer'
  | 'updatePosition'
  | 'updateMember'
  | 'updateLeader'
  | 'updateTwoFactorProvider'
  | 'updateAddress'
  | 'deleteMntcMember'
  | 'deleteSuperMember'
  | 'deleteTeamMember'
  | 'getTeamMembers'
  | 'getMntcTeamMembers'
  | 'getSuperTeamMembers'
  | 'getMntcTeamMembersPage'
  | 'getSuperTeamMembersPage'
  | 'getMyTeamMember'
  | 'getTeamMember'
  | 'getSuperTeamMember'
  | 'getMntcTeamMember';

//#################################################//

export class UserManagementController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
