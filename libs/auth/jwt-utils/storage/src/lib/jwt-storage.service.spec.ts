const mockLocalStorage = {
  setItem: jest.fn(),
  removeItem: jest.fn(),
  getItem: jest.fn(),
};

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  inject: () => mockLocalStorage
}));

import { JWT_AUTH_KEY, JwtStorageService } from './jwt-storage.service';



describe('JwtStorageService', () => {
  let service: JwtStorageService;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    service = new JwtStorageService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store JWT when storeJwt is called with a token', () => {
    service.storeJwt('abc123');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(JWT_AUTH_KEY, 'abc123');
    expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
  });

  it('should remove JWT when storeJwt is called with no argument', () => {
    service.storeJwt();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(JWT_AUTH_KEY);
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it('should remove JWT when storeJwt is called with undefined', () => {
    service.storeJwt(undefined);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(JWT_AUTH_KEY);
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it('should remove JWT when removeJwt is called', () => {
    service.removeJwt();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(JWT_AUTH_KEY);
  });

  it('should get JWT when getStoredToken is called', () => {
    mockLocalStorage.getItem.mockReturnValue('token');
    const result = service.getStoredToken();
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(JWT_AUTH_KEY);
    expect(result).toBe('token');
  });

  it('should return null if no JWT is stored', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const result = service.getStoredToken();
    expect(result).toBeNull();
  });
});
