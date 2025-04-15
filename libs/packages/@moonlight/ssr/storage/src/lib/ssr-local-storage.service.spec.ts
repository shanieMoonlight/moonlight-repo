import { TestBed } from '@angular/core/testing';
import { SsrLocalStorageService } from './ssr-local-storage.service';
import { PLATFORM_ID } from '@angular/core';

//==============================//

describe('SsrLocalStorageService (Browser)', () => {
  let service: SsrLocalStorageService;
  let localStorageMock: any;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 5,
      key: jest.fn()
    };
    
    // Assign mock to global object
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(SsrLocalStorageService);
  });

  //- - - - - - - - - - - - - - - //

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //- - - - - - - - - - - - - - - //

  it('should return length from localStorage', () => {
    expect(service.length).toBe(5);
  });

  it('should call clear method', () => {
    service.clear();
    expect(localStorageMock.clear).toHaveBeenCalled();
  });

  //- - - - - - - - - - - - - - - //

  it('should get item from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('test-value');
    
    const result = service.getItem('test-key');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
    expect(result).toBe('test-value');
  });

  //- - - - - - - - - - - - - - - //

  it('should parse JSON when getting object', () => {
    const testObj = { name: 'test', value: 123 };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(testObj));
    
    const result = service.getItemObject<{name: string, value: number}>('test-key');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
    expect(result).toEqual(testObj);
  });

  //- - - - - - - - - - - - - - - //

  it('should handle parse errors in getItemObject', () => {
    localStorageMock.getItem.mockReturnValue('invalid JSON');
    console.error = jest.fn();
    
    const result = service.getItemObject('test-key');
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  //- - - - - - - - - - - - - - - //

  it('should get key at index', () => {
    localStorageMock.key.mockReturnValue('key-name');
    
    const result = service.key(2);
    expect(localStorageMock.key).toHaveBeenCalledWith(2);
    expect(result).toBe('key-name');
  });

  //- - - - - - - - - - - - - - - //

  it('should remove item', () => {
    service.removeItem('test-key');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
  });

  //- - - - - - - - - - - - - - - //

  it('should set item', () => {
    service.setItem('test-key', 'test-value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', 'test-value');
  });

  //- - - - - - - - - - - - - - - //

  it('should handle errors when setting items', () => {
    console.error = jest.fn();
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    service.setItem('test-key', 'test-value');
    expect(console.error).toHaveBeenCalled();
  });

  //- - - - - - - - - - - - - - - //

  it('should stringify objects when setting object items', () => {
    const testObj = { name: 'test', value: 123 };
    service.setItemObject('test-key', testObj);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testObj));
  });

  //- - - - - - - - - - - - - - - //

  it('should handle errors when setting object items', () => {
    console.error = jest.fn();
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    service.setItemObject('test-key', { test: 'value' });
    expect(console.error).toHaveBeenCalled();
  });
});

//==============================//

describe('SsrLocalStorageService (Server)', () => {
  let service: SsrLocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });
    service = TestBed.inject(SsrLocalStorageService);
  });

  //- - - - - - - - - - - - - - - //

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //- - - - - - - - - - - - - - - //

  it('should return 0 for length', () => {
    expect(service.length).toBe(0);
  });

  //- - - - - - - - - - - - - - - //

  it('should return null for getItem', () => {
    expect(service.getItem('any-key')).toBeNull();
  });

  //- - - - - - - - - - - - - - - //

  it('should return null for getItemObject', () => {
    expect(service.getItemObject('any-key')).toBeNull();
  });

  //- - - - - - - - - - - - - - - //

  it('should return null for key method', () => {
    expect(service.key(0)).toBeNull();
  });

  //- - - - - - - - - - - - - - - //

  it('should not throw for void methods', () => {
    expect(() => {
      service.clear();
      service.removeItem('test');
      service.setItem('test', 'value');
      service.setItemObject('test', { value: 123 });
    }).not.toThrow();
  });
});

//==============================//