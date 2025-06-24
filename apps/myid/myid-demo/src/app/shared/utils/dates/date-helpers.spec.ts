import { DateHelpers, DaysFull, DaysShort } from './date-helpers';

describe('DateHelpers', () => {
  describe('fromMilliSeconds', () => {
    it('returns a Date for valid millis', () => {
      const now = Date.now();
      expect(DateHelpers.fromMilliSeconds(now)?.getTime()).toBe(now);
    });
    it('returns undefined for negative millis', () => {
      expect(DateHelpers.fromMilliSeconds(-1)).toBeUndefined();
    });
    it('returns undefined for non-number', () => {
      // @ts-expect-error  Edge case testing
      expect(DateHelpers.fromMilliSeconds('foo')).toBeUndefined();
    });
  });

  describe('fromSeconds', () => {
    it('returns a Date for valid seconds', () => {
      expect(DateHelpers.fromSeconds(1)?.getTime()).toBe(1000);
    });
    it('returns a Date for 0 seconds', () => {
      expect(DateHelpers.fromSeconds(0)?.getTime()).toBe(0);
    });
    it('returns undefined for negative seconds', () => {
      expect(DateHelpers.fromSeconds(-1)).toBeUndefined();
    });
  });

  describe('formatYearMonthDay', () => {
    it('formats date as YYYY-MM-DD', () => {
      expect(DateHelpers.formatYearMonthDay(new Date('2024-06-24'))).toBe('2024-06-24');
    });
    it('pads month and day', () => {
      expect(DateHelpers.formatYearMonthDay(new Date('2024-01-02'))).toBe('2024-01-02');
    });
    it('uses custom separator', () => {
      expect(DateHelpers.formatYearMonthDay(new Date('2024-06-24'), '/')).toBe('2024/06/24');
    });
  });

  describe('to_dd_MMM_YYYY', () => {
    it('returns formatted string', () => {
      expect(DateHelpers.to_dd_MMM_YYYY('2024-06-24')).toMatch(/24-...-2024/);
    });
    it('returns empty string for undefined', () => {
      expect(DateHelpers.to_dd_MMM_YYYY(undefined)).toBe('');
    });
  });

  describe('dd_MMM_YYYY_HH_mm', () => {
    it('returns formatted string with time', () => {
      const date = new Date('2024-06-24T13:45:00');
      expect(DateHelpers.dd_MMM_YYYY_HH_mm(date)).toMatch(/24-...-2024 13:45/);
    });
    it('returns empty string for undefined', () => {
      expect(DateHelpers.dd_MMM_YYYY_HH_mm(undefined)).toBe('');
    });
  });

  describe('to_dd_MMM_YYYY_Or_Undefined', () => {
    it('returns formatted string', () => {
      expect(DateHelpers.to_dd_MMM_YYYY_Or_Undefined('2024-06-24')).toMatch(/24-...-2024/);
    });
    it('returns undefined for undefined', () => {
      expect(DateHelpers.to_dd_MMM_YYYY_Or_Undefined(undefined)).toBeUndefined();
    });
  });

  describe('toSafeDate', () => {
    it('returns a Date for valid input', () => {
      expect(DateHelpers.toSafeDate('2024-06-24')).toBeInstanceOf(Date);
    });
    it('returns now for undefined', () => {
      const now = Date.now();
      const result = DateHelpers.toSafeDate(undefined).getTime();
      expect(Math.abs(result - now)).toBeLessThan(1000);
    });
  });

  describe('toIonicDate', () => {
    it('returns ISO string in YYYY-MM-DDTHH:mm', () => {
      const date = new Date('2024-06-24T13:45:00');
      expect(DateHelpers.toIonicDate(date)).toBe('2024-06-24T13:45');
    });
    it('returns now if no input', () => {
      const result = DateHelpers.toIonicDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });
  });

  describe('withoutTime', () => {
    it('returns date at midnight', () => {
      const date = new Date('2024-06-24T13:45:00');
      const result = DateHelpers.withoutTime(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('isToday', () => {
    it('returns true for today', () => {
      expect(DateHelpers.isToday(new Date())).toBe(true);
    });
    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(DateHelpers.isToday(yesterday)).toBe(false);
    });
  });

  describe('isTomorrow', () => {
    it('returns true for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(DateHelpers.isTomorrow(tomorrow)).toBe(true);
    });
    it('returns false for today', () => {
      expect(DateHelpers.isTomorrow(new Date())).toBe(false);
    });
  });

  describe('daysAgo', () => {
    it('returns 0 for today', () => {
      expect(DateHelpers.daysAgo(new Date())).toBe(0);
    });
    it('returns 1 for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(DateHelpers.daysAgo(yesterday)).toBe(1);
    });
  });

  describe('isWeekend', () => {
    it('returns true for Sunday', () => {
      expect(DateHelpers.isWeekend(new Date('2024-06-23'))).toBe(true);
    });
    it('returns false for Wednesday', () => {
      expect(DateHelpers.isWeekend(new Date('2024-06-19'))).toBe(false);
    });
    it('returns false for undefined', () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(DateHelpers.isWeekend(undefined!)).toBe(false);
    });
  });

  describe('weekdayNameFull', () => {
    it('returns correct full name', () => {
      expect(DateHelpers.weekdayNameFull(new Date('2024-06-24'))).toBe('Monday');
    });
  });

  describe('weekdayNameShort', () => {
    it('returns correct short name', () => {
      expect(DateHelpers.weekdayNameShort(new Date('2024-06-24'))).toBe('Mon');
    });
  });
});