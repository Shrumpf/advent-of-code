import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2025", "01");

const left = (start) => start - 1 < 0 ? 99 : start - 1;
const right = (start) => start + 1 > 99 ? 0 : start + 1;

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input.split(/\r?\n/);
  let solution = 0;

  let start = 50;

  for (let a of list) {
    let direction = a[0];
    let amount = parseInt(a.slice(1));

    for (let i = 0; i < amount; i++) {
      if (direction === "L") {
        start = left(start);
      } else {
        start = right(start);
      }
    }

    if (start === 0) {
      solution++;
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
  const list = input.split(/\r?\n/);
  let solution = 0;

  let start = 50;

  for (let a of list) {
    let direction = a[0];
    let amount = parseInt(a.slice(1));

    for (let i = 0; i < amount; i++) {
      if (direction === "L") {
        start = left(start);
      } else {
        start = right(start);
      }

      if (start === 0) {
        solution++;
      }
    }
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
