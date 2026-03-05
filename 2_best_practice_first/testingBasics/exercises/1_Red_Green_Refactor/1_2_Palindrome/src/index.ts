export function palindromeChecker(str: string): boolean {
    const normalStr = str.replaceAll(' ', '').toLowerCase();
    const reversedStr = normalStr.split('').reverse().join('');

    return normalStr === reversedStr;
}