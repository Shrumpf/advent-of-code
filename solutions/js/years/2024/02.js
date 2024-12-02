import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "02");

function isSorted(levels) {
  return (
    levels.every((level, i) => !i || levels[i - 1] <= level) ||
    levels.every((level, i) => !i || levels[i - 1] >= level)
  );
}

function checkDistance(level, i, levels) {
  return (
    i === 0 ||
    (Math.abs(level - levels[i - 1]) >= 1 &&
      Math.abs(level - levels[i - 1]) <= 3)
  );
}

function areSafe(levels) {
  return isSorted(levels) && levels.every(checkDistance);
}

function areNotSafe(levels) {
  return !areSafe(levels);
}

function hasSecondChance(levels) {
  return levels.some((_, i) => areSafe(levels.toSpliced(i, 1)));
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  return input
    .split(/\r?\n/)
    .map((report) => report.split(" ").map(Number))
    .filter(areSafe).length;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  let solution = 0;

  const list = input
    .split(/\r?\n/)
    .map((report) => report.split(" ").map(Number));

  solution += list.filter(areSafe).length;
  solution += list.filter(areNotSafe).filter(hasSecondChance).length;

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);

/* Don't look

Yeah... dont...
// function isSortedButCursed(array) {
//   return (
//     `${array.toSorted((a, b) => a - b)}` === `${array}` ||
//     `${array.toSorted((a, b) => b - a)}` === `${array}`
//   );
// }

Not even this... even if its faster than the cursed variant
// function isSortedButJsonCursed(array) {
//   return (
//     JSON.stringify(array.toSorted((a, b) => a - b)) === JSON.stringify(array) ||
//     JSON.stringify(array.toSorted((a, b) => b - a)) === JSON.stringify(array)
//   );
// }
*/
