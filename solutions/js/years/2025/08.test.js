import { describe, it, only } from 'node:test';
import { part_a, part_b } from './08.js';
import { readExampleInput, readExampleSolution } from "../../tools/read.js";
import assert from 'node:assert';

const exampleInput = readExampleInput("2025", "08");

describe("2025 08", () => {
    it("Part A", (c) => {
        const solution = part_a(exampleInput, 10);
        if (solution === undefined) {
            c.skip("solution is undefined");
            return;
        }
        assert.equal(solution, readExampleSolution("2025", "08", "a"));
    });

    it("Part B", (c) => {
        const solution = part_b(exampleInput);
        if (solution === undefined) {
            c.skip("solution is undefined");
            return;
        }
        assert.equal(solution, readExampleSolution("2025", "08", "b"));
    });
});