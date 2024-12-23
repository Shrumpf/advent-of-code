import { describe, it, only } from "node:test";
import { part_a, part_b } from "./22.js";
import { readExampleInput, readExampleSolution } from "../../tools/read.js";
import assert from "node:assert";

const exampleInputA = readExampleInput("2024", "22", "a");
const exampleInputB = readExampleInput("2024", "22", "b");

describe("2024 22", () => {
  it("Part A", (c) => {
    const solution = part_a(exampleInputA);
    if (solution === undefined) {
      c.skip("solution is undefined");
      return;
    }
    assert.equal(solution, readExampleSolution("2024", "22", "a"));
  });

  it("Part B", (c) => {
    const solution = part_b(exampleInputB);
    if (solution === undefined) {
      c.skip("solution is undefined");
      return;
    }
    assert.equal(solution, readExampleSolution("2024", "22", "b"));
  });
});
