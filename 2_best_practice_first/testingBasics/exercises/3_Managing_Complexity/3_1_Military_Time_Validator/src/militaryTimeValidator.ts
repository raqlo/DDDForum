const regex24 = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export function militaryTimeValidator(time: string): boolean {
    const splitTime = time.replaceAll(' ', '').split('-');
    const [firstHour, secondHour] = splitTime;

    // @ts-ignore
    return !(!regex24.test(firstHour) || !regex24.test(secondHour));
}