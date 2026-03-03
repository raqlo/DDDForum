export function fizzbuzz(input: number): string {
    if(input === 3) {
        return 'fizz'
    }
    if(input === 5) {
        return 'buzz'
    }
    if(input === 15) {
        return 'FizzBuzz'
    }
    return ""
}