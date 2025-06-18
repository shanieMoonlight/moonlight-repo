import { TestBed } from '@angular/core/testing';

import { RemoveNullsService } from './remove-nulls.service';

describe('RemoveNullsService', () => {
  let service: RemoveNullsService<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveNullsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
