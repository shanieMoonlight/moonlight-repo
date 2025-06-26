import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AUTH_HEADER, jwtInterceptorFn, TOKEN_PREFIX } from './jwt.interceptor';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  inject: jest.fn()
}));

const { inject } = require('@angular/core');

describe('jwtInterceptorFn', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let mockJwtStore: { getStoredToken: jest.Mock };
  let next: jest.Mock;

  beforeEach(() => {
    mockJwtStore = { getStoredToken: jest.fn() };
    next = jest.fn();
    inject.mockReturnValue(mockJwtStore);
       TestBed.configureTestingModule({
      providers: [
        // Register your interceptor function using withInterceptors
        provideHttpClient(withInterceptors([jwtInterceptorFn])),
        provideHttpClientTesting(), // Provides HttpTestingController
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });




 it('should NOT add an Authorization header if no token is present', () => {
    mockJwtStore.getStoredToken.mockReturnValue(null); // No token

    httpClient.get('/api/data').subscribe();

    const req = httpTestingController.expectOne('/api/data');

    expect(req.request.headers.has(AUTH_HEADER)).toBe(false);
    expect(mockJwtStore.getStoredToken).toHaveBeenCalledTimes(1);

    req.flush({}); // Complete the request
  });



  it('should NOT add an Authorization header if the token is an empty string', () => {
    mockJwtStore.getStoredToken.mockReturnValue(''); // Empty token

    httpClient.get('/api/data').subscribe();

    const req = httpTestingController.expectOne('/api/data');

    expect(req.request.headers.has(AUTH_HEADER)).toBe(false);
    expect(mockJwtStore.getStoredToken).toHaveBeenCalledTimes(1);

    req.flush({}); // Complete the request
  });



  it('should add an Authorization header if a token is present', () => {
    const mockToken = 'my-super-secret-jwt-token';
    mockJwtStore.getStoredToken.mockReturnValue(mockToken); // Jest mockReturnValue

    httpClient.get('/api/data').subscribe();

    const req = httpTestingController.expectOne('/api/data');

    // Jest assertions (toBeTrue, toBe, toHaveBeenCalledTimes)
    expect(req.request.headers.has(AUTH_HEADER)).toBe(true);
    expect(req.request.headers.get(AUTH_HEADER)).toBe(TOKEN_PREFIX + mockToken);
    expect(mockJwtStore.getStoredToken).toHaveBeenCalledTimes(1); // Verify mock was called

    req.flush({}); // Complete the request
  });


  
  it('should preserve existing headers', () => {
    const mockToken = 'another-token';
    mockJwtStore.getStoredToken.mockReturnValue(mockToken);

    httpClient.get('/api/data', { headers: { 'X-Custom-Header': 'test-value' } }).subscribe();

    const req = httpTestingController.expectOne('/api/data');

    expect(req.request.headers.has('X-Custom-Header')).toBe(true);
    expect(req.request.headers.get('X-Custom-Header')).toBe('test-value');
    expect(req.request.headers.has(AUTH_HEADER)).toBe(true);
    expect(mockJwtStore.getStoredToken).toHaveBeenCalledTimes(1);

    req.flush({});
  });


});
