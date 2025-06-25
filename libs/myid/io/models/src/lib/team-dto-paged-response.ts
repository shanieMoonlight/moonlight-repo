import { TeamDto } from './team-dto';
import { PagedRequest } from './paged-request';

export interface TeamDtoPagedResponse {
  data?: TeamDto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}
