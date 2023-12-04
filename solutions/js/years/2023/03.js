import { readExampleInput } from "../../tools/read.js";
import "../../utils/math.js";

const exampleInput = readExampleInput("2023", "03");

function isDigit(str) {
    return /[0-9]/.test(str);
}

function isSymbol(str) {
    return str !== "." && !isDigit(str);
}

function isGear(str) {
    return str === "*";
}




/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_a(input) {
    function checkForNumberInRange(matrix, numbers, coords) {
        const x = coords[1];
        const y = coords[0];

        let ret = 0;

        for (let oY = -1; oY <= 1; oY++) {
            for (let oX = -1; oX <= 1; oX++) {
                let fooIndex = numbers.findIndex(n => n.some(n => n[0] === y + oY && n[1] === x + oX));
                if (fooIndex > -1) {
                    const numb = parseInt(numbers[fooIndex].map(c => matrix[c[0]][c[1]]).join(""));
                    ret += numb;
                    numbers.splice(fooIndex, 1);
                }
            }
        }

        return ret;
    }

    const list = input.split(/\r?\n/).map(l => l.split(""));
    let solution = 0;

    const symbolCoords = [];
    const numberCoords = [];

    for (let y = 0; y < list.length; y++) {
        for (let x = 0; x < list[y].length; x++) {
            if (isSymbol(list[y][x])) {
                symbolCoords.push([y, x]);
            }
        }
    }

    for (let y = 0; y < list.length; y++) {
        let completeDigit = false;
        let tempNumber = [];

        for (let x = 0; x < list[y].length; x++) {
            if (isDigit(list[y][x])) {
                completeDigit = true;
                tempNumber.push([y, x]);
            }

            if ((isSymbol(list[y][x]) || list[y][x] === "." || list[y].length - 1 === x) && completeDigit) {
                completeDigit = false;
                numberCoords.push(tempNumber);
                tempNumber = [];
            }
        }
    }

    for (let coord of symbolCoords) {
        solution += checkForNumberInRange(list, numberCoords, coord);
    }

    return solution;
}

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_b(input) {
    function checkForNumberInRange(matrix, numbers, coords) {
        const x = coords[1];
        const y = coords[0];

        let ret = [];

        for (let oY = -1; oY <= 1; oY++) {
            for (let oX = -1; oX <= 1; oX++) {
                let fooIndex = numbers.findIndex(n => n.some(n => n[0] === y + oY && n[1] === x + oX));
                if (fooIndex > -1) {
                    const numb = parseInt(numbers[fooIndex].map(c => matrix[c[0]][c[1]]).join(""));
                    ret.push(numb);
                    numbers.splice(fooIndex, 1);
                }
            }
        }

        if (ret.length === 2) {
            return ret[0] * ret[1]
        }

        return 0;

    }

    const list = input.split(/\r?\n/).map(l => l.split(""));
    let solution = 0;

    const symbolCoords = [];
    const numberCoords = [];

    for (let y = 0; y < list.length; y++) {
        for (let x = 0; x < list[y].length; x++) {
            if (isGear(list[y][x])) {
                symbolCoords.push([y, x]);
            }
        }
    }

    for (let y = 0; y < list.length; y++) {
        let completeDigit = false;
        let tempNumber = [];

        for (let x = 0; x < list[y].length; x++) {
            if (isDigit(list[y][x])) {
                completeDigit = true;
                tempNumber.push([y, x]);
            }

            if ((isSymbol(list[y][x]) || list[y][x] === "." || list[y].length - 1 === x) && completeDigit) {
                completeDigit = false;
                numberCoords.push(tempNumber);
                tempNumber = [];
            }
        }
    }

    for (let coord of symbolCoords) {
        solution += checkForNumberInRange(list, numberCoords, coord);
    }

    return solution;
}

// part_a(exampleInput);
part_b(exampleInput);