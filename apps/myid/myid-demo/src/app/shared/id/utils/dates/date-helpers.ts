import { StringHelpers } from './string-helpers';
import { TimeInMillis } from './time-in';

//#########################################################//

const daysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export type DaysFull = typeof daysFull[number]
export type DaysShort = typeof daysShort[number]

//#########################################################//

export function isNumber(n: any) { return !isNaN(parseFloat(n)) && isFinite(n); }

//#########################################################//

export class DateHelpers {

  static FromMilliseconds(millis: number): Date {
    try {
      if (!isNumber(millis) || millis < 0) return new Date();

      return new Date(millis);
    } catch (error: unknown) {
      return new Date();
    }
  }

  //-------------------//

  static fromSeconds = (secs?: number): Date =>
    DateHelpers.FromMilliseconds((secs ?? 0) * TimeInMillis.Second);

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
    const hours = StringHelpers.pad(dt.getHours(), 2)
    const mins = StringHelpers.pad(dt.getMinutes(), 2)

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
    } catch (error) {
      return new Date()
    }
  }

  //-------------------//

  /**
   * Formats date fore io-datetime 
   * YYYY-MM-DDTHH:mm	(1994-12-15T13:47)
   */
  static toIonicDate(date?: Date | string): string {

    console.log(date);

    date = new Date(date ??= new Date())

    const day = date.toLocaleString('default', { day: '2-digit' })
    const mnt = date.toLocaleString('default', { month: '2-digit' })
    console.log(mnt);

    const year = date.toLocaleString('default', { year: 'numeric' })
    const hours = StringHelpers.pad(date.getHours(), 2)
    const mins = StringHelpers.pad(date.getMinutes(), 2)


    return `${year}-${mnt}-${day}T${hours}:${mins}`

  }


  //-------------------//


  static withoutTime(date?: Date): Date {

    //Make sure it's a date object
    const d = date ? new Date(date) : new Date()
    d.setHours(0, 0, 0, 0)
    return d

  }

  //-------------------//


  static tsToday(date?: Date): boolean {

    if (!date)
      return false

    const today = new Date()

    return this.withoutTime(today).getTime() === this.withoutTime(date).getTime()

  }

  //-------------------//


  static IsTomorrow(date?: Date): boolean {

    if (!date)
      return false

    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)

    return this.withoutTime(tomorrow).getTime() === this.withoutTime(date).getTime()

  }

  //-------------------//

  static DaysAgo(date: Date | string) {
    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;

    const safeDate = new Date(date)

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(new Date().getMilliseconds() - safeDate.getMilliseconds());

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
