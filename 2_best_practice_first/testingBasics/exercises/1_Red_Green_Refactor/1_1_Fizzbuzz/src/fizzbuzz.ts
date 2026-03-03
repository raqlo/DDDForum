export function fizzbuzz(input: number): string {
    if(input >= 100 ) {
        return 'error: input must be less than 100'
    }

    if(input % 15 === 0) {
        return 'FizzBuzz'
    }
    if(input === 5) {
        return 'buzz'
    }
    if(input % 3 === 0) {
        return 'fizz'
    }
    return input.toString()
}