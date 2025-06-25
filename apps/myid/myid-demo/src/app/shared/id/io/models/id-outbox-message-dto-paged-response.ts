import { IdOutboxMessageDto } from './id-outbox-message-dto';
import { PagedRequest } from './paged-request';

export interface IdOutboxMessageDtoPagedResponse {
  data?: IdOutboxMessageDto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}
