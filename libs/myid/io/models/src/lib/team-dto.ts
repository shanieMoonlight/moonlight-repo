import { AppUserDto } from './app-user-dto';
import { TeamType } from './team-type';

export interface TeamDto {
  id: string;
  name: string;
  description?: string;
  minPosition: number;
  maxPosition: number;
  leaderId?: string;
  leader?: AppUserDto;
  members?: AppUserDto[]
  teamType: TeamType;
}


export interface AddTeamDto {
  name: string;
  description?: string;
  minPosition: number;
  maxPosition: number;
  leaderId?: string;
  leader?: AppUserDto;
  members?: AppUserDto[]
  teamType: TeamType;
}
