export function fizzbuzz(input: any): string {
    if(input >= 100 ) {
        return 'error: input must be less than 100'
    }

    if(input <= 0) {
        return 'error: input must be greater than 0'
    }

    if (typeof input !== "number") {
        return 'error: input must be a number'
    }

    if(input % 15 === 0) {
        return 'FizzBuzz'
    }
    if(input % 5 === 0) {
        return 'buzz'
    }
    if(input % 3 === 0) {
        return 'fizz'
    }
    return input.toString()
}