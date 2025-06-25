import { SubscriptionPlanDto } from './subscription-plan-dto';
import { PagedRequest } from './paged-request';

export interface SubscriptionPlanDtoPagedResponse {
  data?: SubscriptionPlanDto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}
