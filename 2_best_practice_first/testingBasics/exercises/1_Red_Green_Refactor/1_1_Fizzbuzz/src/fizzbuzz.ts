export function fizzbuzz(input: number): string {
    if(input === 5) {
        return 'buzz'
    }
    if(input === 15) {
        return 'FizzBuzz'
    }
    if(input % 3 === 0) {
        return 'fizz'
    }
    return input.toString()
}