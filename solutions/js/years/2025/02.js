import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2025", "02");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  // (.+) matches one or more characters in a group
  // \1 checks if the group repeats exactly once
  const isPattern = (str) => /^(.+)\1$/.test(str);

  const list = input.split(",");
  let solution = 0;

  for (let range of list) {
    let [start, end] = range.split("-").map((n) => parseInt(n));

    for (let i = start; i <= end; i++) {
      if (isPattern(i)) {
        solution += parseInt(i);
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
  // (.+) matches one or more characters in a group
  // \1+ checks if the group repeats one or more times
  const isPattern = (str) => /^(.+)\1+$/.test(str);

  const list = input.split(",");
  let solution = 0;

  for (let range of list) {
    let [start, end] = range.split("-").map((n) => parseInt(n));

    for (let i = start; i <= end; i++) {
      if (isPattern(i)) {
        solution += parseInt(i);
      }
    }
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
