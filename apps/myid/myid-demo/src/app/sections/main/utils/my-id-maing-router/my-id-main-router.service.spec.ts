import { TestBed } from '@angular/core/testing';

import { MyIdMainRouterService } from './my-id-main-router.service';

describe('MyIdMaingRouterService', () => {
  let service: MyIdMainRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyIdMainRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
