export function palindromeChecker(str: unknown): boolean {
    if(typeof str !== "string") {
        throw new Error('Invalid input. Input must be a string')
    }

    if(str.length <= 1) {
        throw new Error('Input must be at least 2 characters long')
    }

    const normalStr = str.replaceAll(' ', '').toLowerCase();
    const reversedStr = normalStr.split('').reverse().join('');

    return normalStr === reversedStr;
}