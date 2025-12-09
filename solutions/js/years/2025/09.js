import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2025", "09");

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_a(input) {
    const list = input.split(/\r?\n/).map(line => line.split(",").map(Number));

    let solution = 0;

    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            const [x1, y1] = list[i];
            const [x2, y2] = list[j];

            const area = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
            if (area > solution) {
                solution = area;
            }
        }
    }

    return solution;
}

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_b(input) {
    function isInRange(x1, x2, y1, y2) {
        return !(x1 <= y1 && x1 <= y2 && x2 <= y1 && x2 <= y2) &&
            !(x1 >= y1 && x1 >= y2 && x2 >= y1 && x2 >= y2);
    }

    function areSidesIntersecting(sides, boundingRect) {
        const [x1, y1] = boundingRect[0];
        const [x2, y2] = boundingRect[1];

        for (let side of sides) {
            const [sx1, sy1] = side[0];
            const [sx2, sy2] = side[1];

            if (isInRange(sy1, sy2, y1, y2) && isInRange(sx1, sx2, x1, x2)) {
                return true;
            }
        }

        return false;
    }

    const list = input.split(/\r?\n/).map(line => line.split(",").map(Number));

    let solution;

    const pairs = [];

    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            const [x1, y1] = list[i];
            const [x2, y2] = list[j];

            const area = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);

            pairs.push([area, list[i], list[j]]);
        }
    }

    pairs.sort((a, b) => b[0] - a[0]);

    const sides = list.map((p, index) => [p, list[index + 1 === list.length ? 0 : index + 1]]);

    const filtered = pairs.find((p) => !areSidesIntersecting(sides, p.slice(1)));

    solution = filtered[0];

    return solution;
}

part_a(exampleInput);
part_b(exampleInput);