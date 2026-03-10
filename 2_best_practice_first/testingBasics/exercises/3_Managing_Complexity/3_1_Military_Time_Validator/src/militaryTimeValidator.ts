const isValid24Time = (time:string) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time);

export function militaryTimeValidator(timeRange: string): boolean {
    const timeRangeUnits = timeRange.replaceAll(' ', '').split('-');
    const [startTime = '', endTime = ''] = timeRangeUnits;
    const startTimeUnit = startTime.split(':')
    const endTimeUnit = endTime.split(':')

    if(!isValid24Time(startTime) || !isValid24Time(endTime)) {
        return false;
    }
    if(startTimeUnit[0] === endTimeUnit[0] && startTimeUnit[1] === endTimeUnit[1]) {
        return false;
    }
    // @ts-ignore
    if(startTimeUnit[0] > endTimeUnit[0] || (startTimeUnit[0] === endTimeUnit[0] && startTimeUnit[1] > endTimeUnit[1])) {
        return false;
    }
    return true;
}