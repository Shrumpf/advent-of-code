import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2022", "01");

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_a(input) {
    const list = input.split(/\r?\n\r?\n/).map(i => i.split(/\r?\n/));
    let solution = 0;

    for (let elf of list) {
        const weight = elf.map(elf => parseInt(elf, 10)).reduce((p, c) => c = c + p, 0);
        if (weight > solution) {
            solution = weight;
        }

    }

    // CODE GOES HERE

    return solution;
}

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_b(input) {
    const list = input.split(/\r?\n\r?\n/).map(i => i.split(/\r?\n/));
    let solution = 0;
    let elfs = [];

    for (let elf of list) {
        const weight = elf.map(elf => parseInt(elf, 10)).reduce((p, c) => c = c + p, 0);
        elfs.push(weight);
    }

    elfs.sort((a, b) => b - a);

    solution = elfs[0] + elfs[1] + elfs[2];

    // CODE GOES HERE

    return solution;
}

part_a(exampleInput);
part_b(exampleInput);