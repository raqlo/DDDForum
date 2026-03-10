const isValid24Time = (time:string) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time);

export function militaryTimeValidator(timeRange: string): boolean {
    const timeRangeUnits = timeRange.replaceAll(' ', '').split('-');
    const [startTime = '', endTime = ''] = timeRangeUnits;

    return !(!isValid24Time(startTime) || !isValid24Time(endTime));
}