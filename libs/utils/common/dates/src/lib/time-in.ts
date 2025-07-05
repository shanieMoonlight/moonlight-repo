export class TimeInMillis {
    static readonly Millsecond = 1
    static readonly Second = 1000 * TimeInMillis.Millsecond;
    static readonly Minute = 60 * TimeInMillis.Second;
    static readonly Hour = 60 * TimeInMillis.Minute;
    static readonly Day = 24 * TimeInMillis.Hour;
    static readonly Week = 7 * TimeInMillis.Day;
}//Cls

//======================================================//

export class TimeInSeconds {
    static readonly Second = 1;
    static readonly Minute = 60 * TimeInMillis.Second;
    static readonly Hour = 60 * TimeInMillis.Minute;
    static readonly Day = 24 * TimeInMillis.Hour;
    static readonly Week = 7 * TimeInMillis.Day;
    static readonly Month = 30 * TimeInMillis.Day;
    static readonly Year = 365 * TimeInMillis.Day;
}//Cls