import { AppUserDto } from './app-user-dto';
import { PagedRequest } from './paged-request';

export interface AppUserDtoPagedResponse {
  data?: AppUserDto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}
