import { Params } from './params';

export interface EmailRoutesDto {
  confirmEmail?: string;
  confirmEmailWithPassword?: string;
  routeParams?: Params;
}
