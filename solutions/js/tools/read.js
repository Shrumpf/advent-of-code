import { readFileSync } from "node:fs";
import path from 'node:path';
import { exit } from "node:process";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input_dir = path.join(__dirname, "../../../inputs");
const examples_dir = path.join(__dirname, "../../../examples");

function read(file) {
    return readFileSync(file, { encoding: "utf8" });
}
/**
 * @param {string} year 
 * @param {string} day 
 * @returns {string}
 */
export function readInput(year, day) {
    return read(path.join(input_dir, year, `${day}.input.txt`));
}

/**
 * @param {string} year 
 * @param {string} day 
 * @returns {string}
 */
export function readExampleInput(year, day) {
    return read(path.join(examples_dir, year, `${day}.input.txt`));
}

/**
 * @param {string} year 
 * @param {string} day 
 * @returns {string}
 */
export function readExampleSolution(year, day, part = "a") {
    return read(path.join(examples_dir, year, `${day}${part}.solution.txt`));
}