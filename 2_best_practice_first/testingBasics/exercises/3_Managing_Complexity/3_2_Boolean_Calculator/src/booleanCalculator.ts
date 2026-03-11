export function booleanCalculator(input: string): boolean {
    const tokens = input.split(' ');

    if (tokens.length === 1) {
        return tokens[0] === 'TRUE';
    }

    if (tokens[0] === 'NOT') {
        return !(tokens[1] === 'TRUE');
    }

    return input === 'TRUE';
}