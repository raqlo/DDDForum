const parseBoolean = (input: string) => input === 'TRUE';
const orOperator = (a: boolean, b: boolean) => a || b;
const andOperator = (a: boolean, b: boolean) => a && b;
const notOperator = (a: boolean) => !a;

export function booleanCalculator(input: string): boolean {
    const tokens = input.split(' ');
    console.log(tokens);
    if (tokens.length > 1 && tokens.length < 3) {
        if (tokens[0] === 'NOT') {
            return notOperator(parseBoolean(tokens[1]));
        }

        if (tokens[1] === 'OR') {
            return orOperator(parseBoolean(tokens[0]), parseBoolean(tokens[2]));
        }

        if (tokens[1] === 'AND') {
            return andOperator(parseBoolean(tokens[0]), parseBoolean(tokens[2]));
        }
    }

    return parseBoolean(input);
}