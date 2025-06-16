export class DateUtils {
  static to_dd_MMM_YYYY(date?: Date | string | null): string {
    if (!date) return '';

    const dt = new Date(date);
    const day = dt.toLocaleString('default', { day: '2-digit' });
    const month = dt.toLocaleString('default', { month: 'short' });
    const year = dt.toLocaleString('default', { year: 'numeric' });

    return day + '-' + month + '-' + year;
  }

  static toIsoString(date?: Date | string | null): string {
    if (!date) return '';

    const dt = new Date(date);

    if (isNaN(dt.getTime())) {
      console.warn('DateUtils.toIsoString: Invalid date input', date);
      return '';
    }
    return dt.toISOString();
  }

  //------------------------------//

  /**
   * Safely converts an ISO string (or Date) to a Date object. Returns null if invalid.
   */
  static fromIsoString(date?: string | Date | null): Date | null {
    if (!date) return null;

    if (date instanceof Date) return isNaN(date.getTime()) ? null : date;

    const dt = new Date(date);
    if (isNaN(dt.getTime())) {
      console.warn('DateUtils.fromIsoString: Invalid date input', date);
      return null;
    }
    return dt;
  }
}
