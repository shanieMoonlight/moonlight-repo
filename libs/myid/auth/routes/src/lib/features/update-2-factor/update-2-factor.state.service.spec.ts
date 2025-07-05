import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UserManagementIoService } from '@spider-baby/myid-io';
import { Update2FactorStateService } from './update-2-factor.state.service';


//######################//

const mockUserMgmtIoService: Partial<UserManagementIoService> = {
  updateTwoFactorProvider: jest.fn()
}

//######################//


describe('Update2FactorStateService', () => {
  let service: Update2FactorStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserManagementIoService, useValue: mockUserMgmtIoService },
        Update2FactorStateService
      ]
    });
    service = TestBed.inject(Update2FactorStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
