import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "07");

function checkOperators(numbers, solution, part) {
  const cache = new Map();

  function recursion(currentIndex, currentValue, part) {
    if (currentIndex === numbers.length) {
      return currentValue === solution;
    }

    const key = `${currentIndex},${currentValue}`;
    if (cache.has(key)) {
      return cache.get(key);
    }

    const num = numbers[currentIndex];

    if (recursion(currentIndex + 1, currentValue + num, part)) {
      cache.set(key, true);
      return true;
    }

    if (recursion(currentIndex + 1, currentValue * num, part)) {
      cache.set(key, true);
      return true;
    }

    if (part === "b") {
      const pipedValue = parseInt(`${currentValue}${num}`, 10);
      if (recursion(currentIndex + 1, pipedValue, part)) {
        cache.set(key, true);
        return true;
      }
    }

    cache.set(key, false);
    return false;
  }

  return recursion(0, 0, part);
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input.split(/\r?\n/);
  let solution = 0;

  for (let row of list) {
    let targetSolution = parseInt(row.split(":")[0]);
    let numbers = row.split(":")[1].split(" ").map(Number);

    if (checkOperators(numbers, targetSolution)) {
      solution += targetSolution;
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

  for (let row of list) {
    let targetSolution = parseInt(row.split(":")[0]);
    let numbers = row.split(":")[1].split(" ").map(Number);

    if (checkOperators(numbers, targetSolution, "b")) {
      solution += targetSolution;
    }
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
