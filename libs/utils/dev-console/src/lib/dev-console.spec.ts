import { devConsole } from './dev-console';
import * as ngCore from '@angular/core';

let isDev = true;
jest.mock('@angular/core', () => ({
  isDevMode: () => isDev,
}));


describe('devConsole', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'group').mockImplementation(() => {});
    jest.spyOn(console, 'groupEnd').mockImplementation(() => {});
    jest.spyOn(console, 'table').mockImplementation(() => {});
    jest.spyOn(console, 'time').mockImplementation(() => {});
    jest.spyOn(console, 'timeEnd').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  describe('in dev mode', () => {
    beforeEach(() => {
      isDev = true;
    });

    it('log should call console.log', () => {
      devConsole.log('foo', 123);
      expect(console.log).toHaveBeenCalledWith('foo', 123);
    });

    it('warn should call console.warn', () => {
      devConsole.warn('bar');
      expect(console.warn).toHaveBeenCalledWith('bar');
    });

    it('error should call console.error', () => {
      devConsole.error('baz');
      expect(console.error).toHaveBeenCalledWith('baz');
    });

    it('group should call console.group', () => {
      devConsole.group('groupLabel');
      expect(console.group).toHaveBeenCalledWith('groupLabel');
    });

    it('groupEnd should call console.groupEnd', () => {
      devConsole.groupEnd();
      expect(console.groupEnd).toHaveBeenCalled();
    });

    it('table should call console.table', () => {
      const data = [{ a: 1 }];
      devConsole.table(data, ['a']);
      expect(console.table).toHaveBeenCalledWith(data, ['a']);
    });

    it('time should call console.time', () => {
      devConsole.time('timer');
      expect(console.time).toHaveBeenCalledWith('timer');
    });

    it('timeEnd should call console.timeEnd', () => {
      devConsole.timeEnd('timer');
      expect(console.timeEnd).toHaveBeenCalledWith('timer');
    });
  });

  describe('in prod mode', () => {
    beforeEach(() => {
      isDev = false;
    });

    it('log should not call console.log', () => {
      devConsole.log('foo');
      expect(console.log).not.toHaveBeenCalled();
    });

    it('warn should not call console.warn', () => {
      devConsole.warn('bar');
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('error should not call console.error', () => {
      devConsole.error('baz');
      expect(console.error).not.toHaveBeenCalled();
    });

    it('group should not call console.group', () => {
      devConsole.group('groupLabel');
      expect(console.group).not.toHaveBeenCalled();
    });

    it('groupEnd should not call console.groupEnd', () => {
      devConsole.groupEnd();
      expect(console.groupEnd).not.toHaveBeenCalled();
    });

    it('table should not call console.table', () => {
      devConsole.table([{ a: 1 }]);
      expect(console.table).not.toHaveBeenCalled();
    });

    it('time should not call console.time', () => {
      devConsole.time('timer');
      expect(console.time).not.toHaveBeenCalled();
    });

    it('timeEnd should not call console.timeEnd', () => {
      devConsole.timeEnd('timer');
      expect(console.timeEnd).not.toHaveBeenCalled();
    });
  });
});