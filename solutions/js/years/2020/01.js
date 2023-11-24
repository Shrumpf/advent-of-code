import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2020", "01");

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_a(input) {
    const list = input.split(/\r?\n/);
    let solution;

    const small = list.filter((itm) => parseInt(itm) < 1000);
    const big = list.filter((itm) => parseInt(itm) >= 1000);

    small.forEach((num) => {
        big.forEach((bnum) => {
            if (parseInt(num) + parseInt(bnum) === 2020) {
                solution = parseInt(num) * parseInt(bnum);
            }
        })
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
    let solution;

    dance:
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
            for (let k = 0; k < list.length; k++) {
                let f = parseInt(list[i]);
                let s = parseInt(list[j]);
                let t = parseInt(list[k]);
                if (f === s || f === t || s === t) {
                    break;
                }

                if (f + s + t === 2020) {
                    solution = f * s * t;
                    break dance;
                }
            }
        }
    }

    return solution;
}

part_a(exampleInput);
part_b(exampleInput);