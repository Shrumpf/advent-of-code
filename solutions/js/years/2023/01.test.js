import { describe, it, only } from 'node:test';
import { part_a, part_b } from './01.js';
import { readExampleInput, readExampleSolution } from "../../tools/read.js";
import assert from 'node:assert';

const exampleInput = (part) => readExampleInput("2023", "01", part);

describe("2023 01", () => {
    it("Part A", (c) => {
        const solution = part_a(exampleInput("a"));
        if (solution === undefined) {
            c.skip("solution is undefined");
            return;
        }
        assert.equal(solution, readExampleSolution("2023", "01", "a"));
    });

    it("Part B", (c) => {
        const solution = part_b(exampleInput("b"));
        if (solution === undefined) {
            c.skip("solution is undefined");
            return;
        }
        assert.equal(solution, readExampleSolution("2023", "01", "b"));
    });
});