import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "01");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const left = [];
  const right = [];

  input.split(/\r?\n/).forEach((row) => {
    const [l, r] = row.split("  ").map(Number);
    left.push(l);
    right.push(r);
  });

  left.sort();
  right.sort();

  return left.reduce((prev, curr, i) => (prev += Math.abs(curr - right[i])), 0);
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  const left = [];
  const right = [];

  input.split(/\r?\n/).forEach((row) => {
    let [l, r] = row.split("  ").map(Number);
    left.push(l);
    right.push(r);
  });

  // {4: 1, 3: 3, 5: 1, 9: 1}
  const rightCounts = right.reduce(
    (prev, curr) => (prev[curr] ? (prev[curr] += 1) : (prev[curr] = 1), prev),
    {}
  );

  return left.reduce(
    (prev, curr, i) => (prev += curr * (rightCounts[curr] ?? 0)),
    0
  );
}

part_a(exampleInput);
part_b(exampleInput);
