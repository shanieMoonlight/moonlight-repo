import { AppUserCustomerDto } from './app-user_customer_dto';
import { PagedRequest } from './paged-request';

export interface AppUser_Customer_DtoPagedResponse {
  data?: AppUserCustomerDto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}
