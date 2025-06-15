export class DateUtils {

    //------------------------------//

    static formatTimeOnly = (date?: Date | null) =>
        date?.toTimeString()?.split(' ')?.[0] ?? '14:00:00'

    //------------------------------//

    static fromTimeOnly(dateStr?: string | null) {
        const today = new Date();
        const [open_hours, open_minutes, open_seconds] = (dateStr ?? '00:00:00').split(':').map(Number);
        return new Date(today.setHours(open_hours, open_minutes, open_seconds, 0));
    }

    //------------------------------//


    static toIsoString(date?: Date | string | null): string {
        if (!date)
            return '';

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
        if (!date)
            return null;

        if (date instanceof Date)
            return isNaN(date.getTime()) ? null : date;

        const dt = new Date(date);
        if (isNaN(dt.getTime())) {
            console.warn('DateUtils.fromIsoString: Invalid date input', date);
            return null;
        }
        return dt;
    }

}//Cls