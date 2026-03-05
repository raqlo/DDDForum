export function palindromeChecker(str: string): boolean {
    if(str.length <= 1) {
        throw new Error('Input must be at least 2 characters long')
    }

    const normalStr = str.replaceAll(' ', '').toLowerCase();
    const reversedStr = normalStr.split('').reverse().join('');

    return normalStr === reversedStr;
}