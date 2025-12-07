import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2025", "07");

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_a(input) {
    const list = input.split(/\r?\n/)
        .filter((line) => line.includes("^"))
        .map((line) => new Set(Array.from(line.matchAll(/\^/g), (m) => m.index)));

    let solution = 0;
    const beams = new Set(list[0]);

    for (let line of list) {
        for (let hit of line.intersection(beams)) {
            beams.delete(hit);
            beams.add(hit + 1);
            beams.add(hit - 1);
            solution++;
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
    const list = input.split(/\r?\n/)
        .filter((line) => line.includes("^"))
        .map((line) => new Set(Array.from(line.matchAll(/\^/g), (m) => m.index)));
    let solution = 0;
    let cache = new Map();

    function getTimelines(depth, col) {
        for (let [idx, line] of list.slice(depth).entries()) {
            if (line.has(col)) {
                let cIdx = `${depth}-${col}`;

                if (!cache.has(cIdx)) {
                    cache.set(cIdx,
                        getTimelines(depth + idx + 1, col - 1) +
                        getTimelines(depth + idx + 1, col + 1));
                }

                return cache.get(cIdx);
            }
        }

        return 1;
    }

    let [beam] = list[0];
    solution = getTimelines(0, beam);

    return solution;
}

part_a(exampleInput);
part_b(exampleInput);