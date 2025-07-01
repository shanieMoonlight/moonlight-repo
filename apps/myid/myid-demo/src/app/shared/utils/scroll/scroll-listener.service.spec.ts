import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ScrollListenerService } from './scroll-listener.service';

// Helper to mock window scroll
function setScroll(y: number) {
  Object.defineProperty(window, 'pageYOffset', { value: y, configurable: true });
  Object.defineProperty(document.documentElement, 'scrollTop', { value: y, configurable: true });
  Object.defineProperty(document.body, 'scrollTop', { value: y, configurable: true });
}

describe('ScrollListenerService', () => {
  describe('in browser', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ScrollListenerService,
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
    });

    it('should be created', () => {
      const service = TestBed.inject(ScrollListenerService);
      expect(service).toBeTruthy();
    });

    it('should emit scroll position on scroll', (done) => {
      const service = TestBed.inject(ScrollListenerService);
      setScroll(123);
      window.dispatchEvent(new Event('scroll'));
      setTimeout(() => {
        expect(service.scrollPosition()).toBe(123);
        done();
      }, 250); // debounceTime(200) + buffer
    });

    it('should debounce scroll events', (done) => {
      const service = TestBed.inject(ScrollListenerService);
      setScroll(10);
      window.dispatchEvent(new Event('scroll'));
      setScroll(20);
      window.dispatchEvent(new Event('scroll'));
      setScroll(30);
      window.dispatchEvent(new Event('scroll'));
      setTimeout(() => {
        expect(service.scrollPosition()).toBe(30);
        done();
      }, 250);
    });
  });

  describe('in server (SSR)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ScrollListenerService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
    });

    it('should emit 0 as scroll position', () => {
      const service = TestBed.inject(ScrollListenerService);
      expect(service.scrollPosition()).toBe(0);
    });
  });
});
