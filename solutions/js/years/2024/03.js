import { readExampleInput } from "../../tools/read.js";
const exampleInputA = readExampleInput("2024", "03", "a");
const exampleInputB = readExampleInput("2024", "03", "b");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = [...input.matchAll(/(mul\((\d+),(\d+)\))/gm)];

  return list.reduce((prev, curr) => (prev += curr[2] * curr[3]), 0);
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  const list = [
    ...input.matchAll(/(mul\((\d+),(\d+)\))|(don't\(\))|(do\(\))/gm),
  ];

  let add = true;

  return list.reduce((prev, curr) => {
    if (curr[0] === "don't()") {
      add = false;
      return prev;
    }

    if (curr[0] === "do()") {
      add = true;
      return prev;
    }

    if (add) {
      return prev + curr[2] * curr[3];
    }

    return prev;
  }, 0);
}

part_a(exampleInputA);
part_b(exampleInputB);
