import { FilterRequest } from './filter-request';
import { SortRequest } from './sort-request';

export interface PagedRequest {
  pageNumber?: number;
  pageSize?: number;
  filterList?: FilterRequest[];
  sortList?: SortRequest[];
}
