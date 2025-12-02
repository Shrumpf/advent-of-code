import { describe, it, only } from 'node:test';
import { part_a, part_b } from './02.js';
import { readExampleInput, readExampleSolution } from "../../tools/read.js";
import assert from 'node:assert';

const exampleInput = readExampleInput("2025", "02");

describe("2025 02", () => {
    it("Part A", (c) => {
        const solution = part_a(exampleInput);
        if (solution === undefined) {
            c.skip("solution is undefined");
            return;
        }
        assert.equal(solution, readExampleSolution("2025", "02", "a"));
    });

    it("Part B", (c) => {
        const solution = part_b(exampleInput);
        if (solution === undefined) {
            c.skip("solution is undefined");
            return;
        }
        assert.equal(solution, readExampleSolution("2025", "02", "b"));
    });
});