import { TestBed } from '@angular/core/testing';
import { ErrorHelpers } from './error-helpers';
import { DeviceHelpers } from './device-helpers';
import { DOCUMENT } from '@angular/common';

describe('ErrorHelpers', () => {
  let service: ErrorHelpers;
  let deviceHelpersMock: Partial<DeviceHelpers>;
  let documentMock: Document;

  beforeEach(() => {
    // Create mock for DeviceHelpers
    deviceHelpersMock = {
      WhatBrowswer: jest.fn().mockReturnValue('Mock Browser'),
      WhatDevice: jest.fn().mockReturnValue('Mock Device')
    };

    // Create mock for Document
    documentMock = {
      location: {
        href: 'https://mock-url.com/test'
      }
    } as unknown as Document;

    TestBed.configureTestingModule({
      providers: [
        ErrorHelpers,
        { provide: DeviceHelpers, useValue: deviceHelpersMock },
        { provide: DOCUMENT, useValue: documentMock }
      ]
    });

    service = TestBed.inject(ErrorHelpers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('objectToString', () => {
    it('should return empty string for null or undefined input', () => {
      // Use the TypeScript private property accessor to test private method
      const result = (service as unknown as { objectToString: (obj?: object) => string }).objectToString(null);
      expect(result).toBe('');
      
      const resultUndefined = (service as unknown as { objectToString: (obj?: object) => string }).objectToString(undefined);
      expect(resultUndefined).toBe('');
    });

    it('should convert object to formatted string', () => {
      // Arrange
      const testObj = {
        name: 'Test Name',
        value: 123
      };
      
      // Act
      const result = (service as unknown as { objectToString: (obj?: object) => string }).objectToString(testObj);
      
      // Assert
      expect(result).toContain('name::Test Name');
      expect(result).toContain('value::123');
      expect(result.split('\r\n').filter(line => line).length).toBe(2); // Check that both properties are included
    });

    it('should handle empty objects', () => {
      // Act
      const result = (service as unknown as { objectToString: (obj?: object) => string }).objectToString({});
      
      // Assert
      expect(result).toBe('');
    });

    it('should handle objects with nested properties', () => {
      // Arrange
      const testObj = {
        nested: {
          prop: 'nested value'
        }
      };
      
      // Act
      const result = (service as unknown as { objectToString: (obj?: object) => string }).objectToString(testObj);
      
      // Assert
      expect(result).toContain('nested::[object Object]');
    });
  });

  describe('createErrorInfoObject', () => {
    it('should create error info object from Error instance', () => {
      // Arrange
      const testError = new Error('Test error message');
      testError.stack = 'Test stack trace';
      
      // Act
      const result = service.createErrorInfoObject(testError);
      
      // Assert
      expect(result.name).toBe('Error');
      expect(result.message).toBe('Test error message');
      expect(result.stack).toBe('Test stack trace');
      expect(result.browser).toBe('Mock Browser');
      expect(result.device).toBe('Mock Device');
      expect(result.window).toBe('https://mock-url.com/test');
    });

    it('should handle string errors', () => {
      // Arrange
      const errorString = 'Simple error string';
      
      // Act
      const result = service.createErrorInfoObject(errorString);
      
      // Assert
      expect(result.message).toBe('Simple error string');
      expect(result.constructor).not.toBe('---');
      expect(result.name.trim()).toBe('---');
    });

    it('should handle undefined/null errors', () => {
      // Act
      const resultUndefined = service.createErrorInfoObject(undefined);
      const resultNull = service.createErrorInfoObject(null);
      
      // Assert
      expect(resultUndefined.message).toBe('undefined');
      expect(resultNull.message).toBe('null');
    });

    it('should handle errors with statusCode', () => {
      // Arrange
      const httpError = {
        statusCode: 404,
        name: 'NotFoundError',
        message: 'Resource not found'
      };
      
      // Act
      const result = service.createErrorInfoObject(httpError);
      
      // Assert
      expect(result.statusCode).toBe(404);
      expect(result.name).toBe('NotFoundError');
      expect(result.message).toBe('Resource not found');
    });

    it('should handle errors with originalError property', () => {
      // Arrange
      const nestedError = {
        message: 'Wrapper error',
        originalError: {
          name: 'OriginalError',
          message: 'Original message'
        }
      };
      
      // Act
      const result = service.createErrorInfoObject(nestedError);
      
      // Assert
      expect(result.message).toBe('Wrapper error');
      expect(result.originalError).toContain('name::OriginalError');
      expect(result.originalError).toContain('message::Original message');
    });

    it('should handle errors with extra info', () => {
      // Arrange
      const errorWithExtraInfo = {
        message: 'Error with extra info',
        xtraInfo: {
          userId: 123,
          context: 'login'
        }
      };
      
      // Act
      const result = service.createErrorInfoObject(errorWithExtraInfo);
      
      // Assert
      expect(result.message).toBe('Error with extra info');
      expect(result.xtraInfo).toEqual({
        userId: 123,
        context: 'login'
      });
    });

    it('should call browser and device detection methods', () => {
      // Arrange
      const testError = new Error('Test error');
      
      // Act
      service.createErrorInfoObject(testError);
      
      // Assert
      expect(deviceHelpersMock.WhatBrowswer).toHaveBeenCalled();
      expect(deviceHelpersMock.WhatDevice).toHaveBeenCalled();
    });

    it('should use fallback values when properties are missing', () => {
      // Arrange
      const emptyError = {};
      
      // Act
      const result = service.createErrorInfoObject(emptyError);
      
      // Assert
      expect(result.name.trim()).toBe('---');
      expect(`${result.statusCode}`.trim()).toBe('---');
      expect(result.message.trim()).toBe('[object Object]');
    });
  });
});
