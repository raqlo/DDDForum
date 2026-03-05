export function palindromeChecker(str: string): boolean {
    const normalStr = str.toLowerCase();
    const reversedStr = normalStr.split('').reverse().join('');
    return normalStr === reversedStr;
}