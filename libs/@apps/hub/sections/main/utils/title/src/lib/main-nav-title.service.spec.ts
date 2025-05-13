import { TestBed } from '@angular/core/testing';

import { HubNavigationService } from '../../../../shared/utils/routing/hub-navigation.service';
import { MainNavTitleService } from './main-nav-title.service';

describe('NavTitleService', () => {
  let service: MainNavTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [HubNavigationService]
    });
    service = TestBed.inject(MainNavTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
