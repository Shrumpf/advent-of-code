import { describe, it, only } from "node:test";
import { part_a, part_b } from "./17.js";
import { readExampleInput, readExampleSolution } from "../../tools/read.js";
import assert from "node:assert";

const exampleInputA = readExampleInput("2024", "17", "a");
const exampleInputB = readExampleInput("2024", "17", "b");

describe("2024 17", () => {
  it("Part A", (c) => {
    const solution = part_a(exampleInputA);
    if (solution === undefined) {
      c.skip("solution is undefined");
      return;
    }
    assert.equal(solution, readExampleSolution("2024", "17", "a"));
  });

  it.skip("Part B", (c) => {
    const solution = part_b(exampleInputB);
    if (solution === undefined) {
      c.skip("solution is undefined");
      return;
    }
    assert.equal(solution, readExampleSolution("2024", "17", "b"));
  });
});
