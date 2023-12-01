import "../../utils/math.js";

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_a(input) {
    const list = input.trim().split(/\r?\n/);
    let solution;

    solution = list
        .map(l => l.replaceAll(/\D/g, ""))
        .map(l => l.at(0) + l.at(-1))
        .map(l => parseInt(l, 10))
        .sum();

    return solution;
}

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_b(input) {
    const list = input.trim().split(/\r?\n/);
    let solution;

    solution = list
        .map(l => l.replaceAll("one", "o1e").replaceAll("two", "t2o").replaceAll("three", "t3e").replaceAll("four", "f4r").replaceAll("five", "f5e").replaceAll("six", "s6x").replaceAll("seven", "s7n").replaceAll("eight", "e8t").replaceAll("nine", "n9e").replaceAll(/\D/g, ""))
        .map(l => l.at(0) + l.at(-1))
        .map(l => parseInt(l, 10))
        .sum();

    return solution;
}