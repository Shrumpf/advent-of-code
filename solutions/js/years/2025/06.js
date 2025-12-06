import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2025", "06");

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_a(input) {
    const list = input.split(/\r?\n/).map(line => line.split(" ").filter(c => c !== ""));

    let solution = 0;

    let isExample = false;
    try {
        list[4][0] === undefined;
    } catch (e) {
        isExample = true;
    }

    for (let i = 0; i < list[0].length; i++) {
        const first = list[0][i];
        const second = list[1][i];
        const third = list[2][i];

        let result;

        if (!isExample) {
            const fourth = list[3][i];
            const operator = list[4][i];
            result = eval(`${first} ${operator} ${second} ${operator} ${third} ${operator} ${fourth}`);
        } else {
            const operator = list[3][i];
            result = eval(`${first} ${operator} ${second} ${operator} ${third}`);
        }

        solution += result;
    }

    return solution;
}

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_b(input) {
    const lines = input.split(/\r?\n/);
    const height = lines.length;
    const width = Math.max(...lines.map(l => l.length));

    const grid = lines.map(l => l.padEnd(width, " "));

    const problems = [];
    let current = [];
    let solution = 0;

    for (let col = width - 1; col >= 0; col--) {
        if (grid.every(row => row[col] === " ")) {
            if (current.length === 0) return;
            problems.push(current);
            current = [];
        } else {
            const colChars = grid.map(row => row[col]);
            current.push(colChars);
        }
    }

    if (current.length === 0) return;
    problems.push(current);

    for (let problem of problems) {
        let opIdx = -1;
        let op = null;

        for (let i = 0; i < problem.length; i++) {
            const c = problem[i][height - 1];
            if (c === "+" || c === "*") {
                opIdx = i;
                op = c;
                break;
            }
        }

        const numbers = problem.map(colChars => {
            const digits = colChars
                .slice(0, height - 1)
                .filter(d => d >= "0" && d <= "9")
                .join("");
            return digits === "" ? 0 : parseInt(digits);
        });

        solution += op === "+"
            ? numbers.reduce((sum, n) => sum + n, 0)
            : numbers.reduce((prod, n) => prod * n, 1);
    }

    return solution;
}

part_a(exampleInput);
part_b(exampleInput);