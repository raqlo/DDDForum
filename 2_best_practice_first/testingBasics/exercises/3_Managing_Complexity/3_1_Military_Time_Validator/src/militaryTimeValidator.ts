const isValid24Time = (time:string) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
const convertTimeToUnits = (timeRangeUnits: string) => {
    const timeUnit = timeRangeUnits.replaceAll(' ', '').split('-');
    return {
        hour: timeUnit[0]!,
        minute: timeUnit[1]!,
    }
}

export function militaryTimeValidator(timeRange: string): boolean {
    const [startTime, endTime] = timeRange.replaceAll(' ', '').split('-');
    if (!startTime || !endTime) return false

    const startTimeUnit = convertTimeToUnits(startTime);
    const endTimeUnit = convertTimeToUnits(endTime);

    if(!isValid24Time(startTime) || !isValid24Time(endTime)) {
        return false;
    }
    if(startTimeUnit.hour === endTimeUnit.hour && startTimeUnit.minute === endTimeUnit.minute) {
        return false;
    }
    if(startTimeUnit.hour > endTimeUnit.hour || (startTimeUnit.hour === endTimeUnit.hour && startTimeUnit.minute > endTimeUnit.minute)) {
        return false;
    }
    return true;
}