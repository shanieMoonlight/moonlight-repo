import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/core';
import { ShareService, ShareResult } from './share.service';

describe('ShareService', () => {
  let service: ShareService;
  let documentMock: Partial<Document>;
  
  // Original navigator object to restore after tests
  const originalNavigator = global.navigator;
  
  beforeEach(() => {
    // Create document mock
    documentMock = {
      location: { href: 'https://test-url.com/page' } as Location,
      title: 'Test Page Title'
    };
    
    // Provide mocks to TestBed
    TestBed.configureTestingModule({
      providers: [
        ShareService,
        { provide: DOCUMENT, useValue: documentMock }
      ]
    });
    
    service = TestBed.inject(ShareService);
  });
  
  afterEach(() => {
    // Restore original navigator after each test
    global.navigator = originalNavigator;
    // Clear all mocks between tests
    jest.clearAllMocks();
  });
  
  describe('shareCurrentPage', () => {
    it('should use Web Share API when available', async () => {
      // Mock navigator.share
      const shareMock = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        configurable: true
      });
      
      const result: ShareResult = await service.shareCurrentPage();
      
      expect(shareMock).toHaveBeenCalledWith({
        title: 'Test Page Title',
        text: 'Check out this Material theme demo:',
        url: 'https://test-url.com/page'
      });
      expect(result).toEqual({
        success: true,
        method: 'webshare'
      });
    });
    
    it('should use custom title and text when provided', async () => {
      // Mock navigator.share
      const shareMock = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        configurable: true
      });
      
      await service.shareCurrentPage('Custom Title', 'Custom Text');
      
      expect(shareMock).toHaveBeenCalledWith({
        title: 'Custom Title',
        text: 'Custom Text',
        url: 'https://test-url.com/page'
      });
    });
    
    it('should fall back to clipboard when Web Share API is not available', async () => {
      // Remove navigator.share
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        configurable: true
      });
      
      // Mock clipboard API for the fallback
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: jest.fn().mockResolvedValue(undefined)
        },
        configurable: true
      });
      
      // Spy on copyToClipboard to verify it's called
      const copyToClipboardSpy = jest.spyOn(service, 'copyToClipboard');
      
      const result: ShareResult = await service.shareCurrentPage();
      
      expect(copyToClipboardSpy).toHaveBeenCalledWith('https://test-url.com/page');
      expect(result).toEqual({
        success: true,
        method: 'clipboard'
      });
    });
    
    it('should handle user cancellation without falling back to clipboard', async () => {
      // Mock navigator.share that throws AbortError
      const abortError = new Error('User cancelled');
      abortError.name = 'AbortError';
      
      Object.defineProperty(navigator, 'share', {
        value: jest.fn().mockRejectedValue(abortError),
        configurable: true
      });
      
      // Spy on copyToClipboard to verify it's NOT called
      const copyToClipboardSpy = jest.spyOn(service, 'copyToClipboard');
      
      const result: ShareResult = await service.shareCurrentPage();
      
      expect(copyToClipboardSpy).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        method: 'webshare',
        error: abortError
      });
    });
    
    it('should fall back to clipboard when Web Share API fails with non-abort error', async () => {
      // Mock navigator.share that throws general error
      const generalError = new Error('Network error');
      
      Object.defineProperty(navigator, 'share', {
        value: jest.fn().mockRejectedValue(generalError),
        configurable: true
      });
      
      // Mock clipboard API for the fallback
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: jest.fn().mockResolvedValue(undefined)
        },
        configurable: true
      });
      
      // Spy on copyToClipboard to verify it's called
      const copyToClipboardSpy = jest.spyOn(service, 'copyToClipboard');
      
      const result: ShareResult = await service.shareCurrentPage();
      
      expect(copyToClipboardSpy).toHaveBeenCalledWith('https://test-url.com/page');
      expect(result).toEqual({
        success: true,
        method: 'clipboard'
      });
    });
  });
  
  describe('copyToClipboard', () => {
    it('should copy text to clipboard successfully', async () => {
      // Mock clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: jest.fn().mockResolvedValue(undefined)
        },
        configurable: true
      });
      
      const result: ShareResult = await service.copyToClipboard('Text to copy');
      
      // Verify clipboard was called with correct text
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Text to copy');
      expect(result).toEqual({
        success: true,
        method: 'clipboard'
      });
    });
    
    it('should handle clipboard write failure', async () => {
      // Mock failed clipboard write
      const clipboardError = new Error('Permission denied');
      
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: jest.fn().mockRejectedValue(clipboardError)
        },
        configurable: true
      });
      
      const result: ShareResult = await service.copyToClipboard('Text to copy');
      
      expect(result).toEqual({
        success: false,
        method: 'none',
        error: clipboardError
      });
    });
    
    it('should handle when clipboard API is not available', async () => {
      // Remove clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        configurable: true
      });
      
      const result: ShareResult = await service.copyToClipboard('Text to copy');
      
      expect(result.success).toBe(false);
      expect(result.method).toBe('none');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Clipboard API not available');
    });
  });
});