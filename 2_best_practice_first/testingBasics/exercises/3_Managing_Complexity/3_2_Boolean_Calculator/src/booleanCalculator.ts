const parseBoolean = (input: string) => input === 'TRUE';

export function booleanCalculator(input: string): boolean {
    const tokens = input.split(' ');

    if (tokens.length > 1) {
        if (tokens[0] === 'NOT') {
            return !parseBoolean(tokens[1]);
        }

        if (tokens[1] === 'OR') {
            return parseBoolean(tokens[0]) || parseBoolean(tokens[2]);
        }

        if (tokens[1] === 'AND') {
            return parseBoolean(tokens[0]) && parseBoolean(tokens[2]);
        }
    }

    return parseBoolean(input);
}