type TimeUnit = {hour: string, minute: string}

const splitTimeRange = (timeRange: string) => timeRange.replaceAll(' ', '').split('-');
const convertTimeToUnits = (timeRangeUnits: string) => {
    const timeUnit = timeRangeUnits.replaceAll(' ', '').split('-');
    return {
        hour: timeUnit[0]!,
        minute: timeUnit[1]!,
    }
}
const isValid24Time = (time:string) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time);

const isStartEqualThanEndTime = (start: TimeUnit , end: TimeUnit) => {
  return start.hour === end.hour && start.minute === end.minute
}

const isStartLaterThanEndTime = (start: TimeUnit, end: TimeUnit) => {
  return start.hour > end.hour || (start.hour === end.hour && start.minute > end.minute)
}

export function militaryTimeValidator(timeRange: string): boolean {
    const [startTime, endTime] = splitTimeRange(timeRange);
    if (!startTime || !endTime) return false

    const startTimeUnit = convertTimeToUnits(startTime);
    const endTimeUnit = convertTimeToUnits(endTime);

    if(!isValid24Time(startTime) || !isValid24Time(endTime)) {
        return false;
    }
    if(isStartEqualThanEndTime(startTimeUnit, endTimeUnit)) {
        return false;
    }
    if(isStartLaterThanEndTime(startTimeUnit, endTimeUnit)) {
        return false;
    }
    return true;
}