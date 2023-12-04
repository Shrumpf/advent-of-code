import { readExampleInput } from "../../tools/read.js";
import "../../utils/math.js";
const exampleInput = readExampleInput("2023", "04");

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_a(input) {
    const list = input.split(/\r?\n/);
    let solution = 0;

    list.map(c => c.split(":")[1].split("|").map(c => c.trim().replaceAll("  ", " ").split(" "))).forEach(card => {
        let points = card[0].filter((val) => card[1].indexOf(val) != -1).length;
        solution += points > 0 ? Math.pow(2, points - 1) : 0;
    });

    return solution;
}

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_b(input) {
    const list = input.split(/\r?\n/);
    let solution = 0;
    let copies = list.map(() => 1);

    list.map(c => c.split(":")[1].split("|").map(c => c.trim().replaceAll("  ", " ").split(" "))).forEach((card, i) => {
        let points = card[0].filter((val) => card[1].indexOf(val) != -1).length;
        solution += points > 0 ? Math.pow(2, points - 1) : 0;
        console.log(copies);
        while (points) {
            copies[i + points--] += copies[i];
        }
    });

    return copies.sum();
}

// part_a(exampleInput);
part_b(exampleInput);