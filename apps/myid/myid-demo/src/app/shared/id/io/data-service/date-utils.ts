export class DateUtils {
 
  static toIsoString(date?: Date | string | null): string {
    if (!date) return '';

    const dt = new Date(date);

    if (isNaN(dt.getTime())) 
      return ''

    return dt.toISOString();
  }

}
