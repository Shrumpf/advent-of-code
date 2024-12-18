import { describe, it, only } from "node:test";
import { part_a, part_b } from "./18.js";
import { readExampleInput, readExampleSolution } from "../../tools/read.js";
import assert from "node:assert";

const exampleInput = readExampleInput("2024", "18");

// Example is 6x6 and uses 12 bytes, while real one is using 70x70 and 1024 bytes
describe("2024 18", () => {
  it("Part A", (c) => {
    const solution = part_a(exampleInput);
    if (solution === undefined) {
      c.skip("solution is undefined");
      return;
    }
    assert.equal(solution, 146);
    // readExampleSolution("2024", "18", "a")
  });

  it("Part B", (c) => {
    const solution = part_b(exampleInput);
    if (solution === undefined) {
      c.skip("solution is undefined");
      return;
    }
    assert.equal(solution, "5,4");
    // readExampleSolution("2024", "18", "b")
  });
});
