import { describe, it, only } from 'node:test';
import { part_a, part_b } from './04.js';
import { readExampleInput, readExampleSolution } from "../../tools/read.js";
import assert from 'node:assert';

const exampleInput = readExampleInput("2024", "04");

describe("2024 04", () => {
    it("Part A", (c) => {
        const solution = part_a(exampleInput);
        if (solution === undefined) {
            c.skip("solution is undefined");
            return;
        }
        assert.equal(solution, readExampleSolution("2024", "04", "a"));
    });

    it("Part B", (c) => {
        const solution = part_b(exampleInput);
        if (solution === undefined) {
            c.skip("solution is undefined");
            return;
        }
        assert.equal(solution, readExampleSolution("2024", "04", "b"));
    });
});