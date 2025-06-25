import { FeatureFlagDto } from './feature-flag-dto';
import { PagedRequest } from './paged-request';

export interface FeatureFlagDtoPagedResponse {
  data?: FeatureFlagDto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}
