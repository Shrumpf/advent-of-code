import { describe, it, only } from "node:test";
import { part_a, part_b } from "./14.js";
import { readInput, readExampleSolution } from "../../tools/read.js";
import assert from "node:assert";

const exampleInput = readInput("2024", "14");

describe("2024 14", () => {
  it("Part A", (c) => {
    const solution = part_a(exampleInput);
    if (solution === undefined) {
      c.skip("solution is undefined");
      return;
    }
    assert.equal(solution, readExampleSolution("2024", "14", "a"));
  });

  it("Part B", (c) => {
    const solution = part_b(exampleInput);
    if (solution === undefined) {
      c.skip("solution is undefined");
      return;
    }
    assert.equal(solution, readExampleSolution("2024", "14", "b"));
  });
});
