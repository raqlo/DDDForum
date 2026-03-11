const parseBoolean = (input: string) => input === 'TRUE';

export function booleanCalculator(input: string): boolean {
    const tokens = input.split(' ');

    if (tokens.length === 1) {
        return parseBoolean(tokens[0]);
    }

    if (tokens[0] === 'NOT') {
        return !parseBoolean(tokens[1]);
    }

    return parseBoolean(input);
}