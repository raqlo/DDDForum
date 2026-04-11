import {describe, it, expect} from "bun:test"
import {militaryTimeValidator} from "./militaryTimeValidator";

const validTimeRanges = [
    "01:12 - 14:32",
    "22:00 - 23:12",
    "00:00 - 00:01",
]

const not24HourTimeRanges = [
    "25:00 - 12:23",
    "12:23 - 12:23",
    "22:00 - 01:12",
    "12:61 - 13:00",
    "25:61 - 13:00"
]

const timeRangeNotInCorrectFormat = [
    "12:23 - 12:23",
    "22:00 - 01:12",
    "12:23",
    "11:35:00 - 12:30",
    "18:23:00 - 20:30:00"
]

describe('Military Time Validator', () => {
    it.each(validTimeRanges)("should know that %p is a valid time range", (range) => {
        const res = militaryTimeValidator(range);
        expect(res).toBeTrue();
    })


    it.each(not24HourTimeRanges)("should know that %p is not a valid 24 hour time range", (range) => {
        const res = militaryTimeValidator(range);
        expect(res).toBeFalse();
    })

    it.each(timeRangeNotInCorrectFormat)("should know that %p is not in the correct format", (range) => {
        const res = militaryTimeValidator(range);
        expect(res).toBeFalse();
    })
});