import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2025", "05");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  let [freshIngredientIdRanges, availableIngredientIds] =
    input.split(/\r?\n\r?\n/);
  let solution = 0;

  freshIngredientIdRanges = freshIngredientIdRanges
    .split(/\r?\n/)
    .map((f) => f.split("-").map((f) => parseInt(f, 10)));

  availableIngredientIds = availableIngredientIds
    .split(/\r?\n/)
    .map((f) => parseInt(f));

  for (let id of availableIngredientIds) {
    for (let range of freshIngredientIdRanges) {
      const [start, end] = range;
      if (id >= start && id <= end) {
        solution++;
        break;
      }
    }
  }

  return solution;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  let [freshIngredientIdRanges, _] = input.split(/\r?\n\r?\n/);
  let solution = 0;

  freshIngredientIdRanges = freshIngredientIdRanges
    .split(/\r?\n/)
    .map((f) => f.split("-").map((f) => parseInt(f, 10)))
    .sort((a, b) => a[0] - b[0]);

  const merged = [freshIngredientIdRanges[0]];

  for (const [start, end] of freshIngredientIdRanges.slice(1)) {
    const last = merged.at(-1);
    if (start <= last[1] + 1) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  for (const [start, end] of merged) {
    solution += end - start + 1;
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
