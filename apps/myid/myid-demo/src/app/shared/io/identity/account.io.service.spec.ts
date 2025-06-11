import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';


import { provideHttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { AccountIoService } from './account.io.service';

describe('AccountIoService', () => {
  let service: AccountIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provide HttpClient
        provideHttpClientTesting(), // Provide testing support
        // Provide the mock Analytics service
        // Provide PLATFORM_ID
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],});
    service = TestBed.inject(AccountIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
