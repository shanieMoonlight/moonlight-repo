export interface IdGlobalOptions {
  applicationName: string;
  mntcAccountsUrl: string;
  mntcTeamMinPosition: number;
  mntcTeamMaxPosition: number;
  superTeamMinPosition: number;
  superTeamMaxPosition: number;
  claimTypePrefix: string;
  jwtRefreshTokensEnabled: boolean;
  phoneTokenTimeSpan: string;
}
