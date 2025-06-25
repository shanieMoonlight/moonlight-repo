import { isNumber } from '@spider-baby/utils-common/numbers';
import { TimeInMillis } from './time-in';

//#########################################################//

const daysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export type DaysFull = typeof daysFull[number]
export type DaysShort = typeof daysShort[number]

//#########################################################//

export class DateHelpers {

  static fromMilliSeconds(millis: number): Date | undefined {
    try {

      if (!isNumber(millis) || millis < 0)
        return undefined;

      return new Date(millis);
    } catch {
      return undefined
    }
  }

  //-------------------//

  static fromSeconds = (secs?: number): Date | undefined =>
    DateHelpers.fromMilliSeconds((secs ?? 0) * TimeInMillis.Second);

  //-------------------//

  static formatYearMonthDay(date: Date = new Date(), separator = '-') {

    const d = new Date(date)
    const year = d.getFullYear();
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate();

    if (month.length < 2) month = '0' + month;

    if (day.length < 2) day = '0' + day;

    return [year, month, day].join(separator);
  }

  //-------------------//


  static to_dd_MMM_YYYY(date?: Date | string | null): string {

    if (!date)
      return ''

    const dt = new Date(date)
    const day = dt.toLocaleString('default', { day: '2-digit' });
    const month = dt.toLocaleString('default', { month: 'short' });
    const year = dt.toLocaleString('default', { year: 'numeric' });

    return day + '-' + month + '-' + year;

  }

  //-------------------//


  static dd_MMM_YYYY_HH_mm(date?: Date | string | null): string {

    if (!date)
      return ''

    const dt = new Date(date)
    const day = dt.toLocaleString('default', { day: '2-digit' });
    const month = dt.toLocaleString('default', { month: 'short' });
    const year = dt.toLocaleString('default', { year: 'numeric' });
    const hours = String(dt.getHours()).padStart(2, '0');
    const mins = String(dt.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${mins}`

  }

  //-------------------//


  static to_dd_MMM_YYYY_Or_Undefined(date?: Date | string | null): string | undefined {

    if (!date)
      return undefined

    const dt = new Date(date)
    const day = dt.toLocaleString('default', { day: '2-digit' });
    const month = dt.toLocaleString('default', { month: 'short' });
    const year = dt.toLocaleString('default', { year: 'numeric' });

    return day + '-' + month + '-' + year;

  }

  //-------------------//

  static toSafeDate(date?: Date | string | null | undefined): Date {

    if (!date)
      return new Date()

    try {
      return new Date(date)
    } catch {
      return new Date()
    }

  }

  //-------------------//

  /**
   * Formats date fore io-datetime 
   * YYYY-MM-DDTHH:mm	(1994-12-15T13:47)
   */
  static toIonicDate(date?: Date | string): string {

    const d = date ? new Date(date) : new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${mins}`;
  }


  //-------------------//


  static withoutTime(date?: Date): Date {

    //Make sure it's a date object
    const d = date ? new Date(date) : new Date()
    d.setHours(0, 0, 0, 0)
    return d

  }

  //-------------------//


  static isToday(date?: Date): boolean {

    if (!date)
      return false

    const today = new Date()

    return this.withoutTime(today).getTime() === this.withoutTime(date).getTime()

  }

  //-------------------//


  static isTomorrow(date?: Date): boolean {

    if (!date)
      return false

    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)

    return this.withoutTime(tomorrow).getTime() === this.withoutTime(date).getTime()

  }

  //-------------------//

  static daysAgo(date: Date | string) {
    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;

    const safeDate = new Date(date)

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(new Date().getTime() - safeDate.getTime());

    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY);
  }

  //-------------------//

  static isWeekend(date: Date | string) {
    if (!date)
      return false
    const safeDate = this.toSafeDate(date)
    const day = safeDate.getDay()
    return day === 0 || day === 6
  }

  //-------------------//

  static weekdayNameFull(date: Date | string) {
    const safeDate = new Date(date)
    return daysFull[safeDate.getDay()];
  }

  //-------------------//

  static weekdayNameShort(date: Date | string) {
    const safeDate = new Date(date)
    return daysShort[safeDate.getDay()];
  }


} //Cls
