declare type Options = {
    alias: boolean;
    seconds: boolean;
    allowBlankDay: boolean;
    allowSevenAsSunday: boolean;
    allowNthWeekdayOfMonth: boolean;
};
export declare const isValidCron: (cron: string, partialOptions?: Partial<Options> | undefined) => boolean;
export {};
