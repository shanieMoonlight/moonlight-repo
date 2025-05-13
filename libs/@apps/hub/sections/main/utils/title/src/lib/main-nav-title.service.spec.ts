import { TestBed } from '@angular/core/testing';
import { HubRouterUtilsService } from '@sb-hub/shared-utils/router';

import { MainNavTitleService } from './main-nav-title.service';

describe('NavTitleService', () => {
  let service: MainNavTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [HubRouterUtilsService]
    });
    service = TestBed.inject(MainNavTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
