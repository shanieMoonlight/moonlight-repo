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

}//Cls