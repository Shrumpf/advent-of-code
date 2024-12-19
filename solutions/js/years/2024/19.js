import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "19");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  let [patterns, designs] = input.split(/\n\n/);
  patterns = patterns.split(", ");
  designs = designs.split(/\r?\n/);

  const cache = new Map();

  function check(design) {
    if (design === "") {
      return true;
    }

    if (cache.has(design)) {
      return cache.get(design);
    }

    for (const pattern of patterns) {
      if (design.startsWith(pattern) && check(design.slice(pattern.length))) {
        cache.set(design, true);
        return true;
      }
    }
    cache.set(design, false);
  }

  const solution = designs.filter(check).length;

  return solution;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  let [patterns, designs] = input.split(/\n\n/);
  patterns = patterns.split(", ");
  designs = designs.split(/\r?\n/);

  const cache = new Map();

  function check(design) {
    if (design === "") {
      return 1;
    }

    if (cache.has(design)) {
      return cache.get(design);
    }

    let ways = 0;
    for (const pattern of patterns) {
      if (design.startsWith(pattern)) {
        ways += check(design.slice(pattern.length), cache);
      }
    }
    cache.set(design, ways);
    return ways;
  }

  const solution = designs.reduce((prev, design) => {
    return prev + check(design);
  }, 0);

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
