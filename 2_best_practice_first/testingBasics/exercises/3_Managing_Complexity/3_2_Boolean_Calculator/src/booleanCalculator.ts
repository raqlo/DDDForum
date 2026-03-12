const parseBoolean = (input: string) => input === 'TRUE';
const parseBooleanToString = (input: boolean) => input ? 'TRUE' : 'FALSE';
const orOperator = (a: boolean, b: boolean) => a || b;
const andOperator = (a: boolean, b: boolean) => a && b;
const notOperator = (a: boolean) => !a;

export function booleanCalculator(input: string): boolean {
    const tokens = input.split(' ');

    if (tokens.length > 1 && tokens.length <= 3) {
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

    if(tokens.length > 3) {
        if(tokens.some(token => token === 'OR')) {
            let i = 0;
            while (i < tokens.length) {
                if (tokens[i] === 'OR') {
                    const result = orOperator(
                        parseBoolean(tokens[i - 1]),
                        parseBoolean(tokens[i + 1])
                    );
                    tokens.splice(i - 1, 3, parseBooleanToString(result));
                    i = 0;
                } else {
                    i++;
                }
            }

        }

        if(tokens.some(token => token === 'AND')) {
            let i = 0;
            while (i < tokens.length) {
                if (tokens[i] === 'AND') {
                    const result = andOperator(
                        parseBoolean(tokens[i - 1]),
                        parseBoolean(tokens[i + 1])
                    );
                    tokens.splice(i - 1, 3, parseBooleanToString(result));
                    i = 0;
                } else {
                    i++;
                }
            }

        }
            return parseBoolean(tokens.join(' '));
    }

    return parseBoolean(input);
}