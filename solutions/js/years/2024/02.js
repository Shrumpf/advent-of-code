import { readExampleInput, readInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "02");

const isSortedA = (arr) => arr.every((v, i, a) => !i || a[i - 1] <= v);
const isSortedD = (arr) => arr.every((v, i, a) => !i || a[i - 1] >= v);

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input.split(/\r?\n/);
  let solution = 0;

  for (let report of list) {
    const levels = report.split(" ").map(Number);

    if (isSortedA(levels) || isSortedD(levels)) {
      let isSafe = true;
      for (let i = 1; i < levels.length; i++) {
        const first = levels[i - 1];
        const second = levels[i];
        const diff = Math.abs(first - second);
        if (diff < 1 || diff > 3) {
          isSafe = false;
          break;
        }
      }
      if (isSafe) {
        solution++;
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
  function isSafe(levels) {
    if (isSortedA(levels) || isSortedD(levels)) {
      let isSafe = true;
      for (let i = 1; i < levels.length; i++) {
        const first = levels[i - 1];
        const second = levels[i];
        const diff = Math.abs(first - second);
        if (diff < 1 || diff > 3) {
          return false;
        }
      }

      if (isSafe) {
        return true;
      }
    }
    return false;
  }

  function trySecondChance(levels) {
    // wtf
    const orig = JSON.parse(JSON.stringify(levels));

    for (let i = 0; i < levels.length; i++) {
      levels.splice(i, 1);
      if (isSafe(levels)) {
        return true;
      }
      // holy shit let my array alone
      levels = [...orig];
    }
    return false;
  }

  const list = input.split(/\r?\n/);
  let solution = 0;

  for (let report of list) {
    const levels = report.split(" ").map(Number);

    let safe = isSafe(levels);
    if (!safe) {
      safe = trySecondChance(levels);
    }

    if (safe) {
      solution++;
    }
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
