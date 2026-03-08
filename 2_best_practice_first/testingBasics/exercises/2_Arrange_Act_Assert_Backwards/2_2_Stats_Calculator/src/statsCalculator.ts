export type StatsCalculatorResponse = {
    average: number;
    minimum: number;
    maximum: number;
    elementsCount: number;
}

/**  Clarify before verify
 * define sum, min, max and average variables;
 * iterate over the array
 * In each iteration check min and max by comparing the current value with the previous value
 * at the end of the loop sum the values and divide by the length of the array /*
 */

export function statsCalculator(array: number[]): StatsCalculatorResponse {
    let average: number = 0;
    let minimum: number = 0;
    let maximum: number = 0;
    let sum: number = 0;
    let elementsCount: number = array.length;

    array.forEach((element, index) => {
        if(index === 0) {
            average = element;
            minimum = element;
            maximum = element;
        } else {
            if(element < minimum) {
                minimum = element;
            }
            if(element > maximum) {
                maximum = element;
            }
        }
    })

    average = sum / elementsCount;

    return {average, minimum, maximum, elementsCount: 0}
}