import { AppUser_Customer_Dto } from './app-user_customer_dto';
import { PagedRequest } from './paged-request';

export interface AppUser_Customer_DtoPagedResponse {
  data?: AppUser_Customer_Dto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}
