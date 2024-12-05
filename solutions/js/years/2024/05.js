import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "05");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input.split(/\r?\n\r?\n/).map((o) => o.split(/\r?\n/));
  let solution = 0;

  const ordering = list[0].map((o) => o.split("|").map(Number));
  const pages = list[1].map((o) => o.split(",").map(Number));

  pages.forEach((page) => {
    const isIncorrect = page.some((value, index) =>
      ordering.find((o) => o[0] === page[index + 1] && o[1] === value)
    );

    if (!isIncorrect) {
      const middle = Math.floor(page.length / 2);
      solution += page[middle];
    }
  });

  return solution;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  function correctIt(page) {
    while (
      page.some((value, index) =>
        ordering.find((o) => o[0] === page[index + 1] && o[1] === value)
      )
    ) {
      for (let i = 0; i < page.length - 1; i++) {
        if (ordering.find((o) => o[0] === page[i + 1] && o[1] === page[i])) {
          [page[i], page[i + 1]] = [page[i + 1], page[i]];
        }
      }
    }
  }
  const list = input.split(/\r?\n\r?\n/).map((o) => o.split(/\r?\n/));
  let solution = 0;

  const ordering = list[0].map((o) => o.split("|").map(Number));
  const pages = list[1].map((o) => o.split(",").map(Number));

  pages.forEach((page) => {
    const isIncorrect = page.some((value, index) =>
      ordering.find((o) => o[0] === page[index + 1] && o[1] === value)
    );

    if (isIncorrect) {
      correctIt(page);
      const middle = Math.floor(page.length / 2);
      solution += page[middle];
    }
  });

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
